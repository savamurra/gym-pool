import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
  writeBatch,
  doc
} from '@angular/fire/firestore';
import {
  TEST_SERVICES,
  TEST_PRICING,
  generateTestBookings
} from '../fixtures/test-data';

@Injectable({
  providedIn: 'root'
})
export class SeederService {

  private firestore = inject(Firestore)

  async seedServices(force = false): Promise<number> {
    const ref = collection(this.firestore, 'services')

    if (!force) {
      const existing = await getDocs(ref)
      if (!existing.empty) {
        console.log('Services уже есть, пропускаем')
        return 0
      }
    }

    if (force) await this.clearCollection('services')

    for (const service of TEST_SERVICES) {
      await addDoc(ref, service)
    }

    return TEST_SERVICES.length
  }

  async seedPricing(force = false): Promise<number> {
    const ref = collection(this.firestore, 'pricing')

    if (!force) {
      const existing = await getDocs(ref)
      if (!existing.empty) {
        console.log('Pricing уже есть, пропускаем')
        return 0
      }
    }

    if (force) await this.clearCollection('pricing')

    for (const pricing of TEST_PRICING) {
      await addDoc(ref, pricing)
    }

    return TEST_PRICING.length
  }

  async seedBookings(count: number = 30): Promise<number> {
    const ref = collection(this.firestore, 'bookings')
    const bookings = generateTestBookings(count)

    for (const booking of bookings) {
      await addDoc(ref, {
        ...booking,
        createdAt: Timestamp.fromDate(booking.createdAt)
      })
    }

    return bookings.length
  }

  async clearCollection(name: string): Promise<number> {
    const ref = collection(this.firestore, name)
    const snapshot = await getDocs(ref)

    if (snapshot.empty) return 0

    const batch = writeBatch(this.firestore)
    snapshot.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()

    return snapshot.size
  }

  async clearBookings(): Promise<number> {
    return this.clearCollection('bookings')
  }
}
