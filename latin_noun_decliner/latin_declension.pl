%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Robert Hergenroder II
% Lin177 Final
%
%
% latin_declension.pl
%
%
% This program is meant to decline Latin nouns. 
% It does this by being given the genitive form, which case is desired, which number is desired,
% and optionally-- the gender if known, via the following predicate, where [...] indicates an 
% optional parameter:
%
% decline_word(INPUT_WORD, CASE, NUMBER, [GENDER], OUTPUT_WORD).
%
% INPUT_WORD must be in the genitive form.
%
% CASE can be of the following options:
% 	[nom], [voc], [acc], [gen], [dat], [abl]
%
% NUMBER can be of the following options:
% 	[sing], [pl]
%
% [GENDER] is optional, and can be of the following options:
% 	[m], [f], [n]
%
% OUTPUT_WORD provides properly declined word(s)
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:-['noun_suffix.pl'].
:-['properties.pl'].


% First declension nouns are easy to identify

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'e'),
	remove_last(BUFF, BUFF2),
	remove_last(BUFF2, BUFF3),
	atom_chars(OUT, BUFF3),
	DECLENSION = [first].


% Second declension nouns require a little more nuance due to their stems

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'i'),
	remove_last(BUFF2, BUFF3),
	atom_chars(OUT, BUFF3),
	DECLENSION = [second, i].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'r'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, 'e'),
	atom_chars(OUT, BUFF2),
	DECLENSION = [second, er].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'r'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, 'i'),
	atom_chars(OUT, BUFF2),
	DECLENSION = [second, ir].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'r'),
	remove_last(BUFF2, BUFF3),
	not(last(BUFF3, 'e')),
	not(last(BUFF3, 'i')),
	atom_chars(OUT, BUFF2),
	DECLENSION = [second].
	
gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	not(last(BUFF2, 'i')),
	not(last(BUFF2, 'r')),
	not(last(BUFF2, 'e')),
	atom_chars(OUT, BUFF2),
	DECLENSION = [second].

% Third declension is tricky as well due to the variations in the singular nominative forms

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 's'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'i'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, 'c'),
	remove_last(BUFF3, BUFF4),
	atom_chars(OUT, BUFF4),
	DECLENSION = [third, x].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 's'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'i'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, 't'),
	remove_last(BUFF3, BUFF4),
	atom_chars(OUT, BUFF4),
	DECLENSION = [third, t].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 's'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'i'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, 'n'),
	remove_last(BUFF3, BUFF4),
	remove_last(BUFF4, BUFF5),
	atom_chars(OUT, BUFF5),
	DECLENSION = [third, n].

	% i-stems are unique in that there are three special cases to be concerned with
	% this implementation is going to merge two of those cases. The only loss with this 
	% merge is 'e' as an ablative ending for words with the same number of syllables in
	% the genitive and nominative (NOTE: traditionally said ablative form can be either 'e' or
	% 'i'). 
	% This merge is a means to not have to define a way to form Latin syllables-- as doing 
	% such would increase the length of the project greatly, and add only a singular, alternate
	% suffix. 

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 's'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'i'),
	remove_last(BUFF2, BUFF3),
	last(BUFF3, X),
	cns(X),
	remove_last(BUFF3, BUFF4),
	last(BUFF4, Y),
	cns(Y),
	atom_chars(OUT, BUFF3), 
	DECLENSION = [third, i, cns].
	

% Fourth declension is relatively straightforward

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 's'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'u'),
	remove_last(BUFF2, BUFF3),
	atom_chars(OUT, BUFF3),
	DECLENSION = [fourth].

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF),
	last(BUFF, 'u'),
	remove_last(BUFF, BUFF2),
	atom_chars(OUT, BUFF2),
	DECLENSION = [fourth].


% Fifth declension is relatively straightforward

gen_to_stem(IN, OUT, DECLENSION):-
	atom_chars(IN, BUFF), 
	last(BUFF, 'i'),
	remove_last(BUFF, BUFF2),
	last(BUFF2, 'e'),
	remove_last(BUFF2, BUFF3),
	atom_chars(OUT, BUFF3),
	DECLENSION = [fifth].


% Decline_word with 4 predicates automatically tries to figure out gender

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	DECLENSION == [first],
	decline_word(IN, CASE, NUMBER, [f], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [second]; 
		DECLENSION == [second, r];
		DECLENSION == [second, er];
		DECLENSION == [second, ir]),
	decline_word(IN, CASE, NUMBER, [m], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [third, x]),
	decline_word(IN, CASE, NUMBER, [m], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [third, t]),
	decline_word(IN, CASE, NUMBER, [f], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [third, n]),
	decline_word(IN, CASE, NUMBER, [n], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [third, i, cns]),
	decline_word(IN, CASE, NUMBER, [f], OUT).


decline_word(IN, CASE, NUMBER, OUT):-
	atom_chars(IN, BUFF),
	not(last(BUFF, 'u')),
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [fourth]),
	decline_word(IN, CASE, NUMBER, [m], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	atom_chars(IN, BUFF),
	last(BUFF, 'u'),
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION = [fourth]),
	decline_word(IN, CASE, NUMBER, [n], OUT).

decline_word(IN, CASE, NUMBER, OUT):-
	gen_to_stem(IN, _, DECLENSION),
	(DECLENSION == [fifth]),
	decline_word(IN, CASE, NUMBER, [f], OUT).

% Gender can be supplied if it is known

decline_word(IN, CASE, NUMBER, GENDER, OUT):-
	gen_to_stem(IN, STEM, DECLENSION),
	suffix(SUFFIX, DECLENSION, CASE, NUMBER, GENDER),
	atom_concat(STEM, SUFFIX, OUT).




remove_last([], []):- !, fail.
remove_last([_], []):- !.
remove_last([H|T], [H|T2]):-
	remove_last(T, T2).
