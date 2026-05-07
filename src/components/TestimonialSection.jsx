import React, { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Asake Adebowale',
    location: 'Lagos Island, Lagos',
    rating: 5,
    text: 'The Beeive Label understands the confident Lagos woman perfectly. I wore the Amara Power Set to a board meeting and walked in feeling unstoppable. The fabric is so luxurious — nothing like anything else on the market.',
    item: 'Amara Power Set',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
  },
  {
    id: 2,
    name: 'Omolade Fasola',
    location: 'Ibadan, Oyo State',
    rating: 5,
    text: 'I ordered for my friend\'s traditional engagement and could not stop getting compliments. The packaging alone felt like a gift. Fast delivery to Ibadan and the quality exceeded every expectation I had.',
    item: 'Temi Wrap Dress',
    avatar: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=200&q=80',
  },
  {
    id: 3,
    name: 'Titilope Ajayi',
    location: 'Ilorin, Kwara State',
    rating: 5,
    text: 'Finally a Nigerian brand that gets it right every time. The fit, the colour, the finishing — all perfect. I have recommended The Beeive Label to everyone in my circle. We deserve brands like this.',
    item: 'Lagos Luxe Co-ord',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80',
  },
  {
    id: 4,
    name: 'Kehinde Olatunde',
    location: 'Osogbo, Osun State',
    rating: 5,
    text: 'I was a little nervous ordering online but the tracking system kept me updated the whole time. When my order arrived I literally screamed — the dress is even more beautiful in person. 10/10 every time.',
    item: 'Sade Evening Gown',
    avatar: 'https://images.unsplash.com/photo-1595956553066-fe24a8c33395?w=200&q=80',
  },
]

export default function TestimonialSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-[#2c2c2c]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-ultra uppercase text-blush mb-3">Our Clients</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-light">What She Says</h2>
        </div>

        {/* Main testimonial */}
        <div className="text-center">
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(testimonials[active].rating)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-blush" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="font-serif text-xl md:text-2xl text-white font-light leading-relaxed italic max-w-3xl mx-auto mb-8 transition-opacity duration-300">
            "{testimonials[active].text}"
          </blockquote>

          {/* Customer */}
          <div className="flex flex-col items-center gap-1">
            <p className="font-sans font-medium text-white text-sm">{testimonials[active].name}</p>
            <p className="font-sans text-xs text-blush tracking-wide">{testimonials[active].location}</p>
          </div>

          <p className="mt-4 font-sans text-xs tracking-widest uppercase text-white/40">
            Wearing: {testimonials[active].item}
          </p>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? 'bg-blush w-6 h-2' : 'bg-white/20 hover:bg-white/40 w-2 h-2'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
