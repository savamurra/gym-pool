import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pricing } from '../models/pool.models';

@Injectable({
  providedIn: 'root'
})
export class PricingDataService {

  private firestore = inject(Firestore)

  private get pricingCollection(): CollectionReference {
    return collection(this.firestore, 'pricing')
  }

  getPricing(): Observable<Pricing[]> {
    const q = query(this.pricingCollection, orderBy('order', 'asc'))
    return collectionData(q, { idField: 'id' }) as Observable<Pricing[]>
  }

  createPricing(pricing: Omit<Pricing, 'id'>): Observable<string> {
    return from(addDoc(this.pricingCollection, pricing))
      .pipe(map(ref => ref.id))
  }

  updatePricing(id: string, pricing: Partial<Pricing>): Observable<void> {
    const docRef = doc(this.firestore, 'pricing', id)
    return from(updateDoc(docRef, pricing))
  }

  deletePricing(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'pricing', id)
    return from(deleteDoc(docRef))
  }
}
