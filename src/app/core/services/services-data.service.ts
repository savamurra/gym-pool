import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  CollectionReference,
  collection,
  query,
  orderBy,
  collectionData,
  addDoc, deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import {from, map, Observable} from 'rxjs';
import {PoolService} from '../models/pool.models';

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService {

  private firestore = inject(Firestore)

  private get servicesCollection(): CollectionReference {
    return collection(this.firestore, 'services')
  }

  getServices(): Observable<PoolService[]> {
    const q = query(this.servicesCollection, orderBy('order', 'asc'))
    return collectionData(q, {idField: 'id'}) as Observable<PoolService[]>
  }

  createService(service: Omit<PoolService, 'id'>): Observable<string> {
    return from(addDoc(this.servicesCollection, service))
      .pipe(map(ref => ref.id))
  }

  updateService(id: string, service: Partial<PoolService>): Observable<void> {
    const docRef = doc(this.firestore, 'services', id)
    return from(updateDoc(docRef, service))
  }

  deleteService(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'services', id)
    return from(deleteDoc(docRef))
  }
}
