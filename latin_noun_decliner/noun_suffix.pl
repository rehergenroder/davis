%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This acts as a database of suffix forms.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


% First Declension

suffix(a, [first], [nom], [sing], _).
suffix(a, [first], [voc], [sing], _).
suffix(am, [first], [acc], [sing], _).
suffix(ae, [first], [gen], [sing], _).
suffix(ae, [first], [dat], [sing], _).
suffix(a, [first], [abl], [sing], _).


suffix(ae, [first], [nom], [pl], _).
suffix(ae, [first], [voc], [pl], _).
suffix(as, [first], [acc], [pl], _).
suffix(arum, [first], [gen], [pl], _).
suffix(is, [first], [dat], [pl], _).
suffix(is, [first], [abl],[pl], _).


% Second Declension

suffix(us, [second], [nom], [sing], [m]).
suffix(e, [second], [voc], [sing], [m]).
suffix(um, [second], [acc], [sing], _).
suffix(i, [second], [gen], [sing], _).
suffix(o, [second], [dat], [sing], _).
suffix(o, [second], [abl], [sing], _).

suffix(um, [second], [nom], [sing], [n]).
suffix(um, [second], [voc], [sing], [n]).


suffix(i, [second], [nom], [pl], [m]).
suffix(i, [second], [voc], [pl], [m]).
suffix(os, [second], [acc], [pl], [m]).
suffix(orum, [second], [gen], [pl], _).
suffix(is, [second], [dat], [pl], _).
suffix(is, [second], [abl], [pl], _).

suffix(a, [second], [nom], [pl], [n]).
suffix(a, [second], [voc], [pl], [n]).
suffix(a, [second], [acc], [pl], [n]).



suffix(ius, [second, i], [nom], [sing], [m]).
suffix(i, [second, i], [voc], [sing], [m]).
suffix(ium, [second, i], [acc], [sing], _).
suffix(ii, [second, i], [gen], [sing], _).
suffix(io, [second, i], [dat], [sing], _).
suffix(io, [second, i], [abl], [sing], _).

suffix(ium, [second, i], [voc], [sing], [n]).
suffix(ium, [second, i], [acc], [sing], [n]).


suffix(ii, [second, i], [nom], [pl], [m]).
suffix(ii, [second, i], [voc], [pl], [m]).
suffix(ios, [second, i], [acc], [pl], [m]).
suffix(iorum, [second, i], [gen], [pl], _).
suffix(iis, [second, i], [dat], [pl], _).
suffix(iis, [second, i], [abl], [pl], _).

suffix(ia, [second, i], [nom], [pl], [n]).
suffix(ia, [second, i], [voc], [pl], [n]).
suffix(ia, [second, i], [acc], [pl], [n]).


suffix('', [second, er], [nom], [sing], [m]).
suffix('', [second, er], [voc], [sing], [m]).
suffix(um, [second, er], [acc], [sing], [m]).
suffix(i, [second, er], [gen], [sing], [m]).
suffix(o, [second, er], [dat], [sing], [m]).
suffix(o, [second, er], [abl], [sing], [m]).


suffix(i, [second, er], [nom], [pl], [m]).
suffix(i, [second, er], [voc], [pl], [m]).
suffix(os, [second, er], [acc], [pl], [m]).
suffix(orum, [second, er], [gen], [pl], [m]).
suffix(is, [second, er], [dat], [pl], [m]).
suffix(is, [second, er], [dat], [pl], [m]).

suffix('', [second, ir], [nom], [sing], [m]).
suffix('', [second, ir], [voc], [sing], [m]).
suffix(um, [second, ir], [acc], [sing], [m]).
suffix(i, [second, ir], [gen], [sing], [m]).
suffix(o, [second, ir], [dat], [sing], [m]).
suffix(o, [second, ir], [abl], [sing], [m]).
	
suffix(i, [second, ir], [nom], [pl], [m]).
suffix(i, [second, ir], [voc], [pl], [m]).
suffix(os, [second, ir], [acc], [pl], [m]).
suffix(orum, [second, ir], [gen], [pl], [m]).
suffix(is, [second, ir], [dat], [pl], [m]).
suffix(is, [second, ir], [dat], [pl], [m]).


suffix(er, [second, r], [nom], [sing], [m]).
suffix(er, [second, r], [voc], [sing], [m]).
suffix(rum, [second, r], [acc], [sing], [m]).
suffix(ri, [second, r], [gen], [sing], [m]).
suffix(ro, [second, r], [dat], [sing], [m]).
suffix(ro, [second, r], [abl], [sing], [m]).
	
suffix(ri, [second, r], [nom], [pl], [m]).
suffix(ri, [second, r], [voc], [pl], [m]).
suffix(ros, [second, r], [acc], [pl], [m]).
suffix(rorum, [second, r], [gen], [pl], [m]).
suffix(ris, [second, r], [dat], [pl], [m]).
suffix(ris, [second, r], [abl], [pl], [m]).


% Third Declension

suffix(x, [third, x], [nom], [sing], [m]).
suffix(x, [third, x], [voc], [sing], [m]).
suffix(cem, [third, x], [acc], [sing], [m]).
suffix(cis, [third, x], [gen], [sing], [m]).
suffix(ci, [third, x], [dat], [sing], [m]).
suffix(ce, [third, x], [abl], [sing], [m]).

suffix(ces, [third, x], [nom], [pl], [m]).
suffix(ces, [third, x], [voc], [pl], [m]).
suffix(ces, [third, x], [acc], [pl], [m]).
suffix(cum, [third, x], [gen], [pl], [m]).
suffix(cibus, [third, x], [dat], [pl], [m]).
suffix(cibus, [third, x], [abl], [pl], [m]).


suffix(s, [third, t], [nom], [sing], [f]).
suffix(s, [third, t], [voc], [sing], [f]).
suffix(tem, [third, t], [acc], [sing], [f]).
suffix(tis, [third, t], [gen], [sing], [f]).
suffix(ti, [third, t], [dat], [sing], [f]).
suffix(te, [third, t], [abl], [sing], [f]).

suffix(tes, [third, t], [nom], [pl], [f]).
suffix(tes, [third, t], [voc], [pl], [f]).
suffix(tes, [third, t], [acc], [pl], [f]).
suffix(tum, [third, t], [gen], [pl], [f]).
suffix(tibus, [third, t], [dat], [pl], [f]).
suffix(tibus, [third, t], [abl], [pl], [f]).


suffix(en, [third, n], [nom], [sing], [n]).
suffix(en, [third, n], [voc], [sing], [n]).
suffix(en, [third, n], [acc], [sing], [n]).
suffix(inis, [third, n], [gen], [sing], [n]).
suffix(ini, [third, n], [dat], [sing], [n]).
suffix(ine, [third, n], [abl], [sing], [n]).

suffix(ina, [third, n], [nom], [pl], [n]).
suffix(ina, [third, n], [voc], [pl], [n]).
suffix(ina, [third, n], [acc], [pl], [n]).
suffix(inum, [third, n], [gen], [pl], [n]).
suffix(inibus, [third, n], [dat], [pl], [n]).
suffix(inibus, [third, n], [abl], [pl], [n]).


% Fourth declension

suffix(us, [fourth], [nom], [sing], [m]).
suffix(us, [fourth], [voc], [sing], [m]).
suffix(um, [fourth], [acc], [sing], [m]).
suffix(us, [fourth], [gen], [sing], [m]).
suffix(ui, [fourth], [dat], [sing], [m]).
suffix(u, [fourth], [abl], [sing], [m]).

suffix(us, [fourth], [nom], [pl], [m]).
suffix(us, [fourth], [voc], [pl], [m]).
suffix(us, [fourth], [acc], [pl], [m]).
suffix(uum, [fourth], [gen], [pl], [m]).
suffix(ibus, [fourth], [dat], [pl], [m]).
suffix(ibus, [fourth], [abl], [pl], [m]).


suffix(u, [fourth], [nom], [sing], [n]).
suffix(u, [fourth], [voc], [sing], [n]).
suffix(u, [fourth], [acc], [sing], [n]).
suffix(us, [fourth], [gen], [sing], [n]).
suffix(ui, [fourth], [dat], [sing], [n]).
suffix(u, [fourth], [abl], [sing], [n]).


suffix(ua, [fourth], [nom], [pl], [n]).
suffix(ua, [fourth], [voc], [pl], [n]).
suffix(ua, [fourth], [acc], [pl], [n]).
suffix(uum, [fourth], [gen], [pl], [n]).
suffix(ibus, [fourth], [dat], [pl], [n]).
suffix(ibus, [fourth], [abl], [pl], [n]).


% Fifth declension

suffix(es, [fifth], [nom], [sing], _).
suffix(es, [fifth], [voc], [sing], _).
suffix(em, [fifth], [acc], [sing], _).
suffix(ei, [fifth], [gen], [sing], _).
suffix(ei, [fifth], [dat], [sing], _).
suffix(e, [fifth], [abl], [sing], _).

suffix(es, [fifth], [nom], [pl], _).
suffix(es, [fifth], [voc], [pl], _).
suffix(es, [fifth], [acc], [pl], _).
suffix(erum, [fifth], [gen], [pl], _).
suffix(ebus, [fifth], [dat], [pl], _).
suffix(ebus, [fifth], [abl], [pl], _).

