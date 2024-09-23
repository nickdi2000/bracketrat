<template>
  <section
    class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl text-gray-500 font-extrabold text-center mb-8">
        Testimonials
      </h2>
      <div class="overflow-x-auto">
        <div class="flex space-x-6">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 p-6 rounded-lg shadow-md min-w-[300px] max-w-xs flex-shrink-0"
          >
            <p class="italic mb-4">"{{ testimonial.text }}"</p>
            <div class="text-right">
              <p class="font-bold">{{ testimonial.name }}</p>
              <p class="text-sm">
                {{ testimonial.position }} at {{ testimonial.company }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Testimonials",
  data() {
    return {
      testimonials: [
        {
          name: "Chris Harper",
          position: "Tournament Director",
          company: "Elite Sports Management",
          text: "BracketForce has revolutionized how we organize tournaments. The QR code feature made participant sign-up seamless and hassle-free!",
        },
        {
          name: "Mia Sanchez",
          position: "Sports Coordinator",
          company: "Youth Soccer Academy",
          text: "Managing brackets has never been this simple. The no-app approach was a game changer for us. BracketForce is now our go-to platform!",
        },
        {
          name: "Jordan Lee",
          position: "Event Organizer",
          company: "Pro Tennis Circuit",
          text: "We needed a reliable and efficient tool for our tournaments, and BracketForce delivered. The simplicity and QR code functionality are fantastic!",
        },
        {
          name: "Emma Williams",
          position: "League Commissioner",
          company: "City Basketball League",
          text: "BracketForce is intuitive and perfect for our needs. Our players love how easy it is to sign up, and I love how easy it is to manage the brackets.",
        },
        {
          name: "Oliver King",
          position: "Event Coordinator",
          company: "National Esports League",
          text: "BracketForce’s simplicity is its strength. The QR code feature alone saves us so much time. We won’t be switching to anything else anytime soon!",
        },
        {
          name: "Sophia Reed",
          position: "Coach",
          company: "High School Football Association",
          text: "Setting up brackets is now something I can do in minutes. BracketForce is just the easiest, most efficient tool out there for event management!",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Tailwind is used, so minimal additional styling is required */
</style>
