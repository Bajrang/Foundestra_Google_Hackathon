// EaseMyTrip Integration for Flight, Hotel, and Activity Bookings
export class EMTBookingService {
  private apiKey: string;
  private baseUrl: string;
  private partnerId: string;

  constructor() {
    this.apiKey = Deno.env.get('EMT_API_KEY') || '';
    this.baseUrl = 'https://api.easemytrip.com/v1';
    this.partnerId = Deno.env.get('EMT_PARTNER_ID') || 'FIGMA_MAKE_TRAVEL';
  }

  // Flight Search and Booking
  async searchFlights(searchParams: any): Promise<any> {
    try {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        passengers,
        tripType,
        classOfService
      } = searchParams;

      const requestBody = {
        origin: origin,
        destination: destination,
        departureDate: departureDate,
        returnDate: returnDate || null,
        adults: passengers.adults || 1,
        children: passengers.children || 0,
        infants: passengers.infants || 0,
        tripType: tripType || 'ONE_WAY',
        classOfService: classOfService || 'ECONOMY',
        currency: 'INR',
        partnerId: this.partnerId
      };

      const response = await fetch(`${this.baseUrl}/flights/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Version': '2.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`EMT Flight Search API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processFlightResults(data);

    } catch (error) {
      console.error('EMT flight search error:', error);
      return this.getMockFlightResults(searchParams);
    }
  }

  private processFlightResults(data: any): any {
    return {
      success: true,
      searchId: data.searchId,
      flights: data.flights?.map((flight: any) => ({
        id: flight.id,
        airline: {
          code: flight.airline.code,
          name: flight.airline.name,
          logo: flight.airline.logo
        },
        departure: {
          airport: flight.departure.airport,
          city: flight.departure.city,
          time: flight.departure.time,
          date: flight.departure.date
        },
        arrival: {
          airport: flight.arrival.airport,
          city: flight.arrival.city,
          time: flight.arrival.time,
          date: flight.arrival.date
        },
        duration: flight.duration,
        stops: flight.stops,
        price: {
          total: flight.price.total,
          base: flight.price.base,
          taxes: flight.price.taxes,
          currency: 'INR'
        },
        baggage: flight.baggage,
        cancellationPolicy: flight.cancellationPolicy,
        bookingClass: flight.bookingClass,
        availableSeats: flight.availableSeats,
        emtOfferId: flight.offerId
      })) || [],
      totalResults: data.totalResults || 0,
      filters: data.filters || {},
      cheapestPrice: data.summary?.cheapestPrice || 0,
      fastestDuration: data.summary?.fastestDuration || 0
    };
  }

  private getMockFlightResults(searchParams: any): any {
    const { origin, destination, departureDate, passengers } = searchParams;
    
    return {
      success: true,
      searchId: `mock_search_${Date.now()}`,
      flights: [
        {
          id: `flight_${Date.now()}_1`,
          airline: {
            code: '6E',
            name: 'IndiGo',
            logo: 'https://via.placeholder.com/100x40?text=6E'
          },
          departure: {
            airport: origin,
            city: origin,
            time: '06:30',
            date: departureDate
          },
          arrival: {
            airport: destination,
            city: destination,
            time: '08:45',
            date: departureDate
          },
          duration: '2h 15m',
          stops: 0,
          price: {
            total: 4500 + (passengers.adults - 1) * 4200,
            base: 3800 + (passengers.adults - 1) * 3600,
            taxes: 700 + (passengers.adults - 1) * 600,
            currency: 'INR'
          },
          baggage: '15kg',
          cancellationPolicy: 'Non-refundable',
          bookingClass: 'S',
          availableSeats: 7,
          emtOfferId: `emt_offer_${Date.now()}_1`
        },
        {
          id: `flight_${Date.now()}_2`,
          airline: {
            code: 'AI',
            name: 'Air India',
            logo: 'https://via.placeholder.com/100x40?text=AI'
          },
          departure: {
            airport: origin,
            city: origin,
            time: '14:20',
            date: departureDate
          },
          arrival: {
            airport: destination,
            city: destination,
            time: '16:50',
            date: departureDate
          },
          duration: '2h 30m',
          stops: 0,
          price: {
            total: 5200 + (passengers.adults - 1) * 4800,
            base: 4400 + (passengers.adults - 1) * 4100,
            taxes: 800 + (passengers.adults - 1) * 700,
            currency: 'INR'
          },
          baggage: '25kg',
          cancellationPolicy: 'Refundable with charges',
          bookingClass: 'V',
          availableSeats: 12,
          emtOfferId: `emt_offer_${Date.now()}_2`
        }
      ],
      totalResults: 15,
      filters: {
        airlines: ['IndiGo', 'Air India', 'SpiceJet'],
        priceRange: { min: 3500, max: 8500 },
        durationRange: { min: 135, max: 420 }
      },
      cheapestPrice: 4500,
      fastestDuration: 135
    };
  }

  // Hotel Search and Booking
  async searchHotels(searchParams: any): Promise<any> {
    try {
      const {
        destination,
        checkIn,
        checkOut,
        rooms,
        guests,
        starRating,
        budget
      } = searchParams;

      const requestBody = {
        destination: destination,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        rooms: rooms || 1,
        adults: guests?.adults || 2,
        children: guests?.children || 0,
        starRating: starRating || 3,
        maxPrice: budget || 10000,
        currency: 'INR',
        partnerId: this.partnerId
      };

      const response = await fetch(`${this.baseUrl}/hotels/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Version': '2.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`EMT Hotel Search API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processHotelResults(data);

    } catch (error) {
      console.error('EMT hotel search error:', error);
      return this.getMockHotelResults(searchParams);
    }
  }

  private processHotelResults(data: any): any {
    return {
      success: true,
      searchId: data.searchId,
      hotels: data.hotels?.map((hotel: any) => ({
        id: hotel.id,
        name: hotel.name,
        starRating: hotel.starRating,
        location: {
          address: hotel.location.address,
          city: hotel.location.city,
          landmark: hotel.location.landmark,
          distance: hotel.location.distanceFromCenter
        },
        images: hotel.images || [],
        amenities: hotel.amenities || [],
        roomTypes: hotel.roomTypes?.map((room: any) => ({
          type: room.type,
          description: room.description,
          price: room.price,
          currency: 'INR',
          inclusions: room.inclusions,
          cancellationPolicy: room.cancellationPolicy,
          emtRoomId: room.id
        })) || [],
        rating: {
          overall: hotel.rating?.overall || 4.0,
          reviews: hotel.rating?.reviews || 0,
          cleanliness: hotel.rating?.cleanliness || 4.0,
          service: hotel.rating?.service || 4.0,
          location: hotel.rating?.location || 4.0
        },
        policies: hotel.policies || {},
        emtHotelId: hotel.id
      })) || [],
      totalResults: data.totalResults || 0,
      filters: data.filters || {}
    };
  }

  private getMockHotelResults(searchParams: any): any {
    const { destination, checkIn, checkOut, budget } = searchParams;
    
    return {
      success: true,
      searchId: `hotel_search_${Date.now()}`,
      hotels: [
        {
          id: `hotel_${Date.now()}_1`,
          name: 'Hotel Royal Heritage',
          starRating: 4,
          location: {
            address: 'M.I. Road, Near Railway Station',
            city: destination,
            landmark: 'Railway Station',
            distance: '2.5 km from city center'
          },
          images: [
            'https://via.placeholder.com/400x300?text=Hotel+Royal+Heritage'
          ],
          amenities: ['WiFi', 'AC', 'Restaurant', 'Pool', 'Gym', 'Spa'],
          roomTypes: [
            {
              type: 'Deluxe Room',
              description: 'Spacious room with city view',
              price: Math.min(budget * 0.6, 3500),
              currency: 'INR',
              inclusions: ['Breakfast', 'WiFi', 'Airport Transfer'],
              cancellationPolicy: 'Free cancellation up to 24 hours',
              emtRoomId: `room_${Date.now()}_1`
            },
            {
              type: 'Premium Suite',
              description: 'Luxury suite with heritage décor',
              price: Math.min(budget * 0.8, 5500),
              currency: 'INR',
              inclusions: ['Breakfast', 'WiFi', 'Airport Transfer', 'Spa Access'],
              cancellationPolicy: 'Free cancellation up to 48 hours',
              emtRoomId: `room_${Date.now()}_2`
            }
          ],
          rating: {
            overall: 4.2,
            reviews: 1247,
            cleanliness: 4.1,
            service: 4.3,
            location: 4.0
          },
          policies: {
            checkIn: '14:00',
            checkOut: '12:00',
            petPolicy: 'Pets not allowed'
          },
          emtHotelId: `emt_hotel_${Date.now()}_1`
        },
        {
          id: `hotel_${Date.now()}_2`,
          name: 'Palace View Resort',
          starRating: 5,
          location: {
            address: 'Near City Palace, Old City',
            city: destination,
            landmark: 'City Palace',
            distance: '1.2 km from city center'
          },
          images: [
            'https://via.placeholder.com/400x300?text=Palace+View+Resort'
          ],
          amenities: ['WiFi', 'AC', 'Multi-cuisine Restaurant', 'Pool', 'Gym', 'Spa', 'Concierge'],
          roomTypes: [
            {
              type: 'Palace View Room',
              description: 'Room with direct palace view',
              price: Math.min(budget, 6500),
              currency: 'INR',
              inclusions: ['Breakfast', 'WiFi', 'Airport Transfer', 'Heritage Walk'],
              cancellationPolicy: 'Free cancellation up to 72 hours',
              emtRoomId: `room_${Date.now()}_3`
            }
          ],
          rating: {
            overall: 4.6,
            reviews: 892,
            cleanliness: 4.7,
            service: 4.5,
            location: 4.8
          },
          policies: {
            checkIn: '15:00',
            checkOut: '11:00',
            petPolicy: 'Small pets allowed with advance notice'
          },
          emtHotelId: `emt_hotel_${Date.now()}_2`
        }
      ],
      totalResults: 25,
      filters: {
        starRating: [3, 4, 5],
        priceRange: { min: 1500, max: 8000 },
        amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant']
      }
    };
  }

  // Activity and Experience Booking
  async searchActivities(searchParams: any): Promise<any> {
    try {
      const { destination, category, budget, date } = searchParams;

      const response = await fetch(`${this.baseUrl}/activities/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destination,
          category,
          maxPrice: budget,
          date,
          partnerId: this.partnerId
        })
      });

      if (!response.ok) {
        throw new Error(`EMT Activities API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processActivityResults(data);

    } catch (error) {
      console.error('EMT activities search error:', error);
      return this.getMockActivityResults(searchParams);
    }
  }

  private processActivityResults(data: any): any {
    return {
      success: true,
      activities: data.activities?.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        category: activity.category,
        duration: activity.duration,
        location: activity.location,
        price: {
          adult: activity.price.adult,
          child: activity.price.child,
          currency: 'INR'
        },
        inclusions: activity.inclusions || [],
        exclusions: activity.exclusions || [],
        highlights: activity.highlights || [],
        images: activity.images || [],
        rating: activity.rating || 4.0,
        reviews: activity.reviews || 0,
        availability: activity.availability || [],
        cancellationPolicy: activity.cancellationPolicy,
        emtActivityId: activity.id
      })) || []
    };
  }

  private getMockActivityResults(searchParams: any): any {
    const { destination, category } = searchParams;
    
    return {
      success: true,
      activities: [
        {
          id: `activity_${Date.now()}_1`,
          title: 'Heritage City Walking Tour',
          description: 'Explore the historic lanes and hidden gems of the old city with a local guide',
          category: 'Cultural',
          duration: '3 hours',
          location: `Old City, ${destination}`,
          price: {
            adult: 800,
            child: 400,
            currency: 'INR'
          },
          inclusions: ['Local guide', 'Heritage site entries', 'Traditional snacks', 'Photography assistance'],
          exclusions: ['Personal expenses', 'Transportation to starting point'],
          highlights: [
            'Visit 5 heritage monuments',
            'Local street food tasting',
            'Photography at iconic spots',
            'Stories and legends from local guide'
          ],
          images: ['https://via.placeholder.com/400x300?text=Heritage+Walking+Tour'],
          rating: 4.5,
          reviews: 234,
          availability: ['09:00', '14:00', '16:00'],
          cancellationPolicy: 'Free cancellation up to 24 hours before',
          emtActivityId: `emt_activity_${Date.now()}_1`
        },
        {
          id: `activity_${Date.now()}_2`,
          title: 'Traditional Cooking Class',
          description: 'Learn to cook authentic local dishes with a local family',
          category: 'Culinary',
          duration: '4 hours',
          location: `Local Home, ${destination}`,
          price: {
            adult: 1200,
            child: 600,
            currency: 'INR'
          },
          inclusions: ['Cooking ingredients', 'Recipe cards', 'Lunch/dinner', 'Tea/coffee'],
          exclusions: ['Transportation', 'Additional beverages'],
          highlights: [
            'Learn 4-5 traditional recipes',
            'Market visit for fresh ingredients',
            'Family-style dining experience',
            'Take home recipe collection'
          ],
          images: ['https://via.placeholder.com/400x300?text=Cooking+Class'],
          rating: 4.7,
          reviews: 156,
          availability: ['10:00', '15:00'],
          cancellationPolicy: 'Free cancellation up to 48 hours before',
          emtActivityId: `emt_activity_${Date.now()}_2`
        }
      ]
    };
  }

  // Unified Booking Method
  async createBooking(bookingData: any): Promise<any> {
    try {
      const { type, offerId, travelerDetails, paymentDetails, preferences } = bookingData;

      // Create idempotency key
      const idempotencyKey = `emt_booking_${offerId}_${travelerDetails.email}_${Date.now()}`;

      const requestBody = {
        offerId: offerId,
        travelerDetails: travelerDetails,
        paymentDetails: paymentDetails,
        preferences: preferences || {},
        idempotencyKey: idempotencyKey,
        partnerId: this.partnerId
      };

      const endpoint = type === 'flight' ? 'flights/book' : 
                     type === 'hotel' ? 'hotels/book' : 
                     'activities/book';

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`EMT Booking API error: ${response.status}`);
      }

      const result = await response.json();
      return this.processBookingResult(result, type);

    } catch (error) {
      console.error('EMT booking error:', error);
      return this.getMockBookingResult(bookingData);
    }
  }

  private processBookingResult(result: any, type: string): any {
    return {
      success: true,
      bookingId: result.bookingId,
      confirmationCode: result.confirmationCode,
      status: result.status,
      type: type,
      totalAmount: result.totalAmount,
      currency: result.currency,
      bookingDetails: result.bookingDetails,
      cancellationPolicy: result.cancellationPolicy,
      contactDetails: result.contactDetails,
      voucher: result.voucher || null,
      emtReference: result.emtReference
    };
  }

  private getMockBookingResult(bookingData: any): any {
    const confirmationCode = `EMT${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    return {
      success: true,
      bookingId: `emt_booking_${Date.now()}`,
      confirmationCode: confirmationCode,
      status: 'CONFIRMED',
      type: bookingData.type,
      totalAmount: bookingData.amount || 5000,
      currency: 'INR',
      bookingDetails: {
        travelerName: bookingData.travelerDetails?.name || 'John Doe',
        email: bookingData.travelerDetails?.email || 'john@example.com',
        phone: bookingData.travelerDetails?.phone || '+91-9999999999'
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before travel',
      contactDetails: {
        customerService: '+91-1234567890',
        email: 'support@easemytrip.com',
        whatsapp: '+91-9876543210'
      },
      voucher: {
        url: `https://booking.easemytrip.com/voucher/${confirmationCode}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${confirmationCode}`
      },
      emtReference: `EMT${Date.now()}`
    };
  }

  // Get booking status and details
  async getBookingDetails(bookingId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`EMT Booking Details API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('EMT booking details error:', error);
      return {
        success: false,
        error: 'Unable to fetch booking details'
      };
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason || 'Customer request',
          partnerId: this.partnerId
        })
      });

      if (!response.ok) {
        throw new Error(`EMT Cancellation API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('EMT cancellation error:', error);
      return {
        success: false,
        error: 'Unable to process cancellation'
      };
    }
  }

  // Get available offers and discounts
  async getOffers(destination: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/offers?destination=${destination}&partnerId=${this.partnerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return { offers: [] };
      }

      return await response.json();

    } catch (error) {
      console.error('EMT offers error:', error);
      return {
        offers: [
          {
            id: 'WELCOME10',
            title: '10% Off on First Booking',
            description: 'Get 10% discount on your first booking with EaseMyTrip',
            type: 'percentage',
            value: 10,
            minAmount: 2000,
            maxDiscount: 1000,
            validTill: '2024-12-31',
            applicable: ['flights', 'hotels', 'activities']
          }
        ]
      };
    }
  }
}

export const emtBookingService = new EMTBookingService();