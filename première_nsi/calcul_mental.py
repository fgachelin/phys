# -*- coding: utf-8 -*-
"""
Created on Wed Jun  9 19:12:20 2021

@author: Francois Gachelin
"""

import random, time

o=["+", "-"]# opérateurs

def rdm(n):
    return random.randint(0,n)

def init():
    global debut
    debut=time.time()
    print("================================================")
    print(" Donne 10 bonnes réponses le plus vite possible")
    print("================================================")
    jeu(0)

def jeu(score):
    expression=str(rdm(10)-1)+o[rdm(1)]+str(rdm(10)-1)+o[rdm(1)]+str(rdm(10)-1)
    n=int(input("\n"+expression+" = "))
    while n!=eval(expression):
        n=int(input("\n"+expression+" = "))
    if score<10:
        jeu(score+1)
    else:
        fin=time.time()
        t=str(fin-debut)
        print("\n====== Gagné en "+t+"s! =====\n")
        q=input("Refaire une partie? o/n ")
        if q=="o":
            init()
        
init()
    
    