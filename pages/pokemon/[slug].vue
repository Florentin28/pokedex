<script setup>
const query = gql`
  query Pokemon($slug: String!) {
    pokemon(where: { slug: $slug }) {
      id
      nom
      poids
      taille
      slug
      description
      createdAt
      publishedAt
      updatedAt
      stage
      pv
      typePokemon {
        type
        logoType {
          url
        }
      }
      attaque1 {
        nom
        description
        degats
      }
      attaque2 {
        nom
        description
        degats
      }

      image {
        url(
          transformation: {
            image: { resize: { fit: crop, height: 1024, width: 1024 } }
            document: { output: { format: webp } }
          }
        )
      }
    }
  }
`;

const pokemon = ref();
const route = useRoute();
const { data } = await useAsyncQuery(query, {
  slug: route.params.slug,
});
console.log(data.value);
pokemon.value = data.value.pokemon;
</script>

<template>
  <Head v-if="pokemon">
    <Title>{{ pokemon.nom }} - Détails du Pokémon</Title>
    <Meta
      name="description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta
      property="og:title"
      :content="`${pokemon.nom} - Détails du Pokémon`"
    />
    <Meta
      property="og:description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta property="og:image" :content="pokemon.image.url" />
    <Meta property="og:type" content="website" />
    <Meta property="og:locale" content="fr_FR" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta
      name="twitter:title"
      :content="`${pokemon.nom} - Détails du Pokémon`"
    />
    <Meta
      name="twitter:description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta name="twitter:image" :content="pokemon.image.url" />
  </Head>

  <div
    v-if="pokemon"
    class="max-w-md mx-auto bg-blue-500 rounded-md overflow-hidden shadow-md border-4 border-yellow-400 h-full"
  >
    <!-- PV et Type sur la même ligne -->
    <div class="p-4 flex justify-between items-start">
      <!-- Nom du Pokémon -->
      <h2 class="text-2xl font-bold">{{ pokemon.nom }}</h2>

      <!-- PV et Type -->
      <div class="flex items-center">
        <div class="text-gray-600 mr-4">PV : {{ pokemon.pv }}</div>
        <NuxtImg
          v-if="pokemon.typePokemon && pokemon.typePokemon.logoType"
          :src="pokemon.typePokemon.logoType.url"
          :alt="pokemon.typePokemon.type"
          class="w-12 h-12 rounded-full"
        />
        <p v-else class="ml-2">Non défini</p>
      </div>
    </div>

    <!-- Image du Pokémon -->
    <NuxtImg
      class="w-full h-full object-contain"
      :src="pokemon.image.url"
      :alt="pokemon.nom"
    />

    <!-- Attaques -->
    <div class="p-4">
      <ul class="list-disc list-inside">
        <li>{{ pokemon.attaque1.nom }}</li>
        <li>{{ pokemon.attaque2.nom }}</li>
      </ul>
    </div>
  </div>

  <div v-else>
    <li>Loading...</li>
  </div>
</template>
