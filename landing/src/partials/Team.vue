<script setup>
import TeamImg01 from "../images/team-01.jpg";
import TeamImg02 from "../images/team-02.jpg";
import TeamImg03 from "../images/team-03.jpg";
import TeamImg04 from "../images/team-04.jpg";
import TeamImg05 from "../images/team-05.jpg";
import TeamImg06 from "../images/team-06.jpg";
import TeamImg07 from "../images/team-07.jpg";
import TeamImg08 from "../images/team-08.jpg";
import TeamImg09 from "../images/team-09.jpg";
import TeamImg10 from "../images/team-10.jpg";
import TeamImg11 from "../images/team-11.jpg";
import TeamImg12 from "../images/team-12.jpg";

const teamMembers = [
  {
    image: TeamImg01,
    name: "Lara Lamprecht",
    role: "CEO and Founder",
  },
  {
    image: TeamImg02,
    name: "Timothy Chandran",
    role: "Head of Sales",
  },
  {
    image: TeamImg03,
    name: "Marie Koniuszek",
    role: "Customer Success Lead",
  },
  {
    image: TeamImg04,
    name: "Alyssa Chuzeville",
    role: "Head of Product",
  },
  {
    image: TeamImg05,
    name: "Dominik Prasad",
    role: "Senior Researcher",
  },
  {
    image: TeamImg06,
    name: "Darya Semenova",
    role: "Software Engineer",
  },
  {
    image: TeamImg07,
    name: "Mary Pullgat",
    role: "Software Engineer",
  },
  {
    image: TeamImg08,
    name: "Quentin Renvoye",
    role: "Senior Marketing Manager",
  },
  {
    image: TeamImg09,
    name: "Justin Jackson",
    role: "Content & SEO Lead",
  },
  {
    image: TeamImg10,
    name: "Alice Nguyen",
    role: "Engineering Manager",
  },
  {
    image: TeamImg11,
    name: "Duyk Hermann",
    role: "Product Designer",
  },
  {
    image: TeamImg12,
    name: "Kevon Cheung",
    role: "Creative Director",
  },
];
</script>

<template>
  <section>
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20"
      >
        <!-- Section header -->
        <div class="mx-auto max-w-3xl pb-12 text-center md:pb-20">
          <h2
            class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text text-3xl font-semibold text-transparent md:text-4xl"
          >
            It's all about the people
          </h2>
        </div>

        <!-- Members -->
        <div class="flex flex-wrap justify-center gap-8 md:gap-16">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="w-40 text-center md:w-52"
          >
            <div
              class="relative mb-4 inline-flex before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-indigo-500 before:to-gray-950 before:opacity-15"
            >
              <img
                class="rounded-full"
                :src="member.image"
                width="80"
                height="80"
                :alt="member.name"
              />
            </div>
            <div class="font-nacelle mb-1 text-lg text-gray-200">
              {{ member.name }}
            </div>
            <p class="text-sm text-indigo-200/65">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
