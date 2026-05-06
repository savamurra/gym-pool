import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData, deleteDoc, doc,
  Firestore,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from '@angular/fire/firestore';
import {from, map, Observable} from 'rxjs';
import {Booking, BookingStatus} from '../models/pool.models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private firestore = inject(Firestore)
  private bookingsCollection = collection(this.firestore, 'bookings')

  getBookings(): Observable<Booking[]> {
    const q = query(this.bookingsCollection, orderBy('createdAt', 'desc'))
    return collectionData(q, { idField: 'id' }).pipe(
      map(data => data.map(item => ({
        ...item,
        createdAt: (item['createdAt'] as Timestamp).toDate()
      })) as Booking[])
    )
  }

  createBooking(booking: Omit<Booking, 'id'>): Observable<string> {
    return from(
      addDoc(this.bookingsCollection, {
        ...booking,
        createdAt: Timestamp.fromDate(new Date()),
        status: 'new' as BookingStatus
      })
    ).pipe(map(ref => ref.id))
  }

  updateStatus(id: string, status: BookingStatus): Observable<void> {
    const bookingDoc = doc(this.firestore, 'bookings', id)
    return from(updateDoc(bookingDoc, { status }))
  }

  deleteBooking(id: string): Observable<void> {
    const bookingDoc = doc(this.firestore, 'bookings', id)
    return from(deleteDoc(bookingDoc))
  }
}
