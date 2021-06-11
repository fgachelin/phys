# -*- coding: utf-8 -*-
"""
Created on Wed Jun  9 19:12:20 2021

@author: Francois Gachelin
"""

import random, time

def init():
    global N
    global debut
    N=random.randint(0, 1000)
    debut=time.time()
    print("============================================")
    print(" Devine le nombre N compris entre 0 et 1000")
    print("============================================")
    jeu()

def jeu():
    n=int(input("\nNombre proposé: "))
    if n<N:
        print("\nN>"+str(n))
        jeu()
    elif n>N:
        print("\nN<"+str(n))
        jeu()
    else:
        fin=time.time()
        t=str(fin-debut)
        print("\n====== Gagné en "+t+"s! =====\n")
        q=input("Refaire une partie? o/n ")
        if q=="o":
            init()
        
init()
    
    