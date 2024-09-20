<template>
  <div class="mt-12 flex justify-center">
    <div class="p-5 mx-5 max-w-xl">
      <div class="text-center">
        <svg
          class="fadein mx-auto"
          fill="#fff"
          height="88px"
          width="88px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 41.948 41.948"
          xml:space="preserve"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <g id="c65_sport_shoes">
                <path
                  d="M40.859,31.671v-2.965c0-0.195-0.418-0.354-0.924-0.354H0.93C0.42,28.351,0,28.51,0,28.706v2.965 c0,0.193,0.42,0.354,0.93,0.354h39.005C40.441,32.024,40.859,31.865,40.859,31.671z"
                ></path>
                <path
                  d="M39.259,21.575c0,0-15.575-1.708-22.614-10.881c0,0-3.311-3.732-0.537,5.229c0,0,0.428,6.506-6.932,3.199 c0,0-2.51-0.862-4.801-6.402c0,0-1.119-2.248-2.83-1.769C0.867,11.173,0.053,11.966,0,14.535v1.178h4.561v1.881H0v9.104h16.535 l4.439-7.681h2.176l-4.217,7.681h2.629l2.959-4.854h2.326L24,26.698h2.604l1.371-2.428H30l-1.342,2.427h12.197 C40.859,26.697,44.164,22.749,39.259,21.575z"
                ></path>
              </g>
              <g id="Capa_1_236_"></g>
            </g>
          </g>
        </svg>
        <h1 class="header font-bold uppercase mb-8">{{ $appName }} Guide</h1>
      </div>

      <div class="introduction">
        <div class="mb-4">
          Welcome to the {{ $appName }} admin portal. The goal of
          {{ $appName }} is to make it easy for you to create and manage your
          tournament brackets.
        </div>
        <div class="mb-4">
          You may create a elimination-style "bracket" or a "round-robin" style
          tournament. When building an elimintation-style bracket, you can build
          it in two ways:<br />
          <strong>Dynamic</strong> or <strong>Fixed</strong>.
        </div>
        <div class="mb-4">
          You may have noticed that all traditional elimination brackets are
          vertically symetrical. (or to get technical, a geometric sequence with
          a common power of 2). AKA: 2 4, 8, 16, 32, 64. This way each person
          starts out by playing one other person, and the winner moves on to
          play another winner, and so on. This is why you will rarely see a "12
          team" bracket generator...or any other number outside of the mentioned
          list. However if you have a number of teams that is not a power of 2,
          you can use the "Dynamic" bracket generator. This will allow you to
          create a bracket with any number of teams, and the bracket will
          automatically adjust to the number of teams you have, inserting "bye"
          rounds where necessary.
        </div>
        <div class="mb-4">
          You may choose to allow players/teams to register themselves, and
          watch the bracket grow as more people join. Or you may choose to
          manually add players/teams to the bracket yourself. <i>Or</i> you can
          do a combination of both. Still have questions?
          <router-link
            to="/admin/contact"
            class="underline text-blue-300 font-bold hover:text-blue-500"
          >
            Contact us</router-link
          >
          anytime!
        </div>
      </div>

      <div>
        <div class="mx-auto py-4 mt-8">
          <Button @click="$router.go(-1)" class="btn btn-dark">
            <ArrowLongLeftIcon class="h-4 w-4 inline" />
            Back</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
