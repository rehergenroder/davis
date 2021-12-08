#include "MapRouter.h"
#include "XMLParser.h"
#include <cmath>
#include <limits>
#include <unordered_map>
#include <queue>
#include <set>

//removeme when done debug
#include <iostream>

#define DEGREES_TO_RADIANS(angle)   (M_PI * (angle) / 180.0)

class CMapRouter::CImplementation : public CXMLParser{
    public:
		double minLat, minLon, maxLat, maxLon;
        static double MaxDeltaLongitude(double dist, double lat){
            const double EarthCircumferenceMiles = 3959.88 * M_PI * 2.0;  
            return 360.0 * dist / (cos(DEGREES_TO_RADIANS(lat)) * EarthCircumferenceMiles);
        };

        static double MaxDeltaLatitude(double dist){
            const double EarthCircumferenceMiles = 3959.88 * M_PI * 2.0;  
            return 360.0 * dist / EarthCircumferenceMiles;
        };

		struct road{
			long endID;
			std::string name;
			long double distance;
			double travelTime;
			double endLat;
			double endLon;
		};
		
		struct node{
			long id;
			double lon;
			double lat;
			std::vector<road> connections;
		};
		struct wayBuff{
			long id;
			std::vector<long> longersectionIDs;
			std::string name;
			long double speed;
			bool oneWay;
		};
		std::unordered_map<long, node> intersections;
		wayBuff roadBuffer;
		long numIntersections;
		bool endInput;
		bool noPath;


		void init(){
			noPath = false;
			numIntersections = 0;
			maxLat = 38.5178523;
			maxLon = -121.7712408;
			minLat = 38.5178523;
			minLon = -121.7712408;
			intersections.reserve(15000);
		}
	
		void makeIntersection(const std::vector<TAttribute>& attrs){
			long id = stol(attrs[0].DValue);
			intersections[id].id = id;
			intersections[id].lat = stod(attrs[1].DValue);
			intersections[id].lon = stod(attrs[2].DValue);
			++numIntersections;
			if(intersections[id].lat > maxLat){
				maxLat = intersections[id].lat;
			}
			else if(intersections[id].lat < minLat){
				minLat = intersections[id].lat;
			}
			if(intersections[id].lon > maxLon){
				maxLon = intersections[id].lon;
			}
			else if(intersections[id].lon < minLon){
				minLon = intersections[id].lon;
			}
		}

		void makeRoad(const std::vector<TAttribute>& attrs){
			roadBuffer.speed = 25;
			roadBuffer.oneWay = false;
		}

		void setBufferAttributes(const std::vector<TAttribute>& attrs){
			if(attrs[0].DValue == "name"){
				roadBuffer.name = attrs[1].DValue;
			}
			else if(attrs[0].DValue == "ref" && roadBuffer.name.length() == 0){
				roadBuffer.name = attrs[1].DValue;
			}
			else if(attrs[0].DValue == "oneway" && attrs[1].DValue == "yes"){
				roadBuffer.oneWay = true;
			}
			else if(attrs[0].DValue == "maxspeed"){
				roadBuffer.speed = stod(attrs[1].DValue);
			}
		}

		void clearRoadBuffer(){
			roadBuffer.speed = 25;
			roadBuffer.oneWay = false;
			roadBuffer.longersectionIDs.clear();
			roadBuffer.name.clear();
		}

		void makeIntersectionConnections(){
			std::unordered_map<long, node>:: iterator itr1, itr2;
			road buff;
			double distBuff;

			for(unsigned long i = 0; i < roadBuffer.longersectionIDs.size(); i++){
				itr1 = intersections.find(roadBuffer.longersectionIDs[i]);
				if(!roadBuffer.oneWay){
					if(i > 0){
						itr2 = intersections.find(roadBuffer.longersectionIDs[i-1]);
						buff.endID = itr2->first;
						distBuff = HaversineDistance(itr1->second.lat, itr1->second.lon, itr2->second.lat, itr2->second.lon);
						buff.distance = distBuff;
						buff.travelTime = distBuff / roadBuffer.speed;
						buff.name = roadBuffer.name;
						buff.endLat = itr2->second.lat;
						buff.endLon = itr2->second.lon;
						itr1->second.connections.push_back(buff);
					}
				}
				if(i < roadBuffer.longersectionIDs.size() - 1){
					itr2 = intersections.find(roadBuffer.longersectionIDs[i+1]);
					buff.endID = itr2->first;
					distBuff = HaversineDistance(itr1->second.lat, itr1->second.lon, itr2->second.lat, itr2->second.lon);
					buff.distance = distBuff;
					buff.travelTime = distBuff / roadBuffer.speed;
					buff.name = roadBuffer.name;
					buff.endLat = itr2->second.lat;
					buff.endLon = itr2->second.lon;
					itr1->second.connections.push_back(buff);	
				}			
			}
		}
		
		void StartElement(const std::string &name, const std::vector<TAttribute> &attrs){
			endInput = false;
            if(name == "node"){
                makeIntersection(attrs);
            }   
            else if(name == "way"){
             	makeRoad(attrs); 
            }
			else if(name == "nd"){
				if(intersections.find(stol(attrs[0].DValue)) != intersections.end()){
					roadBuffer.longersectionIDs.push_back(stol(attrs[0].DValue));
				}
			}
			else if(name == "tag"){
				setBufferAttributes(attrs);
			}
         }   
         void EndElement(const std::string &name){
			if(name == "way"){
				makeIntersectionConnections();
				clearRoadBuffer();
			}
			if(name == "node"){
				clearRoadBuffer();
			}
      	}

		long closestNode(double lat, double lon){
			long returnVal;
			double buff = INFINITY;
			std::unordered_map<long, node>:: iterator itr;
			for(itr = intersections.begin(); itr != intersections.end(); ++itr){
				if(buff > HaversineDistance(lat, lon, itr->second.lat, itr->second.lon)){
						buff = HaversineDistance(lat, lon, itr->second.lat, itr->second.lon);
						returnVal = itr->first;
				}
			}	
			return returnVal;	
		}



//BEGIN SEARCH DATA SLASH ALGORITHMS HERE
		struct ucsPath{
			std::vector<long> path;
			double totalDistance;
			double estimate;
		};

		class ucsDistanceComparison{
			public:
				bool operator() (ucsPath p1, ucsPath p2){
					return(p1.estimate > p2.estimate);
				}
		};

		std::vector<long> route;
		double totalDistance, totalTime;
		bool flag = false;
		void uniformCostSearch(long source, long dest){
			std::priority_queue<ucsPath, std::vector<ucsPath>, ucsDistanceComparison> vertexSet;
			std::set<long> visited;
			
			ucsPath current;
			current.path.push_back(source);
			current.totalDistance = 0;
			auto srcItr = intersections.find(source);
			auto destItr = intersections.find(dest);
			current.estimate = HaversineDistance(srcItr->second.lat, srcItr->second.lon, destItr->second.lat, destItr->second.lon);

			vertexSet.push(current);

			while(true){
				if(vertexSet.size() == 0){
					noPath = true;
					return;
				}

				current = vertexSet.top();
				vertexSet.pop();

				if(current.path.back() == dest){
					for(auto elem : current.path){
						route.push_back(elem);
					}
					totalDistance = current.totalDistance;
					return;
				}
				for(auto elem : intersections.find(current.path.back())->second.connections){
					if(visited.find(elem.endID) == visited.end()){
						ucsPath buff = current;
						buff.path.push_back(elem.endID);
						buff.totalDistance += elem.distance;
						buff.estimate = buff.totalDistance + HaversineDistance(elem.endLat, elem.endLon, destItr->second.lat, destItr->second.lon);
						vertexSet.push(buff);
						visited.insert(current.path.back());
					}
				}
			}	
		}
//TIME
		struct ucsTimePath{
			std::vector<long> path;
			double totalTime;
			double estimate;
		};

		class ucsTimeComparison{
			public:
				bool operator() (ucsTimePath p1, ucsTimePath p2){
					return(p1.estimate > p2.estimate);
				}
		};


		void uniformTimeSearch(long source, long dest){
			std::priority_queue<ucsTimePath, std::vector<ucsTimePath>, ucsTimeComparison> vertexSet;
			std::set<long> visited;
			
			ucsTimePath current;
			current.path.push_back(source);
			current.totalTime = 0;
			auto srcItr = intersections.find(source);
			auto destItr = intersections.find(dest);
			current.estimate = HaversineDistance(srcItr->second.lat, srcItr->second.lon, destItr->second.lat, destItr->second.lon)/60;

			vertexSet.push(current);
			visited.insert(source);

			do{
				if(vertexSet.size() == 0){
					noPath = true;
					return;
				}

				current = vertexSet.top();
				vertexSet.pop();

				if(current.path.back() == dest){
					for(auto elem : current.path){
						route.push_back(elem);
					}
					totalTime = current.totalTime;
					return;
				}
				for(auto elem : intersections.find(current.path.back())->second.connections){

					if(visited.find(elem.endID) == visited.end()){
						ucsTimePath buff = current;
						buff.path.push_back(elem.endID);
						buff.totalTime += elem.travelTime;
						buff.estimate = buff.totalTime + HaversineDistance(elem.endLat, elem.endLon, destItr->second.lat, destItr->second.lon)/60;

						vertexSet.push(buff);
						visited.insert(current.path.back());
					}
				}
			}while(1);	
		}


		double shortestPath(long source, long dest, std::vector<unsigned long>& path){
			uniformCostSearch(source, dest);
			if(noPath){
				return std::numeric_limits<double>::max();
			}
			double returnValue = 0;
			for(auto elem : route){
				path.push_back(elem);
			}	
		
			route.clear();
			return totalDistance;
		}

		
		double quickestPath(long source, long dest, std::vector<unsigned long>& path){
			if(noPath){
				noPath = false;
				return std::numeric_limits<double>::max();
			}
			uniformTimeSearch(source, dest);
				
			for(auto elem : route){
				path.push_back(elem);
			}
			route.clear();
			return totalTime;
		}

		void getNames(const std::vector<unsigned long>& path, std::vector<std::string>& streetNames){
			if(path.size() == 0){
				return;
			}
			int count = 0;
			std::unordered_map<long, node> :: iterator itr = intersections.find(path[0]);
			for(unsigned long i = 0; i < path.size(); i++){
				if(i > 0){
					itr = intersections.find(path[i-1]);
				}
				for(unsigned long j = 0; j < itr->second.connections.size(); j++){
					if(path[i] == itr->second.connections[j].endID && itr->second.connections[j].name != ""){
						if(count == 0){
							streetNames.push_back(itr->second.connections[j].name);
							count++;
							break;
						}
						else if(streetNames[count - 1] != itr->second.connections[j].name){
							streetNames.push_back(itr->second.connections[j].name);
							count++;
							break;
						}
					}
				}
			}
		}
		
};


CMapRouter::CMapRouter() : DData(std::make_unique< CImplementation>()){
	DData->init();    
}

CMapRouter::~CMapRouter(){
    
}


// Modified from https://rosettacode.org/wiki/Haversine_formula#C.2B.2B
double CMapRouter::HaversineDistance(double lat1, double lon1, double lat2, double lon2){
	double LatRad1 = DEGREES_TO_RADIANS(lat1);
	double LatRad2 = DEGREES_TO_RADIANS(lat2);
	double LonRad1 = DEGREES_TO_RADIANS(lon1);
	double LonRad2 = DEGREES_TO_RADIANS(lon2);
	double DeltaLat = LatRad2 - LatRad1;
	double DeltaLon = LonRad2 - LonRad1;
	double DeltaLatSin = sin(DeltaLat/2);
	double DeltaLonSin = sin(DeltaLon/2);	
	double Computation = asin(sqrt(DeltaLatSin * DeltaLatSin + cos(LatRad1) * cos(LatRad2) * DeltaLonSin * DeltaLonSin));
	const double EarthRadiusMiles = 3959.88;
	
	return 2 * EarthRadiusMiles * Computation;
}

void CMapRouter::GetMapExtents(double &minlat, double &minlon, double &maxlat, double &maxlon) const{	
	minlat = DData->minLat;
	minlon = DData->minLon;
	maxlat = DData->maxLat;
	maxlon = DData->maxLon;
}

void CMapRouter::LoadMap(std::istream &is){
	DData->Parse(is);
}

CMapRouter::TNodeID CMapRouter::FindClosestNode(double lat, double lon){
	return DData->closestNode(lat, lon);
}

double CMapRouter::FindShortestPath(TNodeID src, TNodeID dest, std::vector< TNodeID > &path){
	path.clear();
	return DData->shortestPath(src, dest, path);
}

double CMapRouter::FindFastestPath(TNodeID src, TNodeID dest, std::vector< TNodeID > &path){
	path.clear();
    return DData->quickestPath(src, dest, path);
}

bool CMapRouter::GetPathStreetNames(const std::vector< TNodeID > &path, std::vector< std::string > &streetnames) const{
	DData->getNames(path, streetnames);
    return true;
}
