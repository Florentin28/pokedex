<script setup>
const query = gql`
  query Pokemons {
    pokemons(orderBy: id_ASC) {
      createdAt
      description
      id
      nom
      publishedAt
      slug
      updatedAt
      image {
        url(
          transformation: {
            document: { output: { format: webp } }
            image: { resize: { fit: crop, height: 512, width: 512 } }
          }
        )
      }
    }
  }
`;

const pokemons = ref();
const { data } = await useAsyncQuery(query);
console.log(data.value);
pokemons.value = data.value.pokemons;
</script>

<template>
  <ul
    v-if="pokemons"
    class="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
  >
    <li v-for="pokemon in pokemons" :key="pokemon.id">
      <NuxtLink
        :to="`/pokemon/${pokemon.slug}`"
        class="relative inline-block overflow-hidden rounded-md"
      >
        <NuxtImg
          :src="pokemon.image.url"
          :alt="pokemon.nom"
          class="w-full h-auto transition-transform transform hover:brightness-125 hover:scale-105 rounded-md"
        />
        <h2 class="text-3xl text-center mt-2 text-stroke-white font-bold">
          {{ pokemon.nom }}
        </h2>
      </NuxtLink>
    </li>
  </ul>
  <ul v-else>
    <li>Loading...</li>
  </ul>
</template>

<style>
.text-stroke-white {
  color: white;
  -webkit-text-stroke: 1.5px black;
}
</style>
