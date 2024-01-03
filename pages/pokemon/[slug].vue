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
      decor {
        nom
        image {
          url
        }
      }
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

const getTypeBackgroundColor = (type) => {
  switch (type) {
    case "Poison":
      return "#a1a1eb"; // violet
    case "Eau":
      return "#B3E0FF"; // Bleu pastel
    case "Plante":
      return "#B3FFB3"; // Vert pastel
    case "Vol":
      return "#E0E0E0"; // Blanc pastel
    case "Electrique":
      return "#FFF9B3"; // Jaune pastel
    case "Roche":
      return "#D2B48C"; // Brun pastel
    default:
      return "#FFFFFF"; // Gris pastel par défaut si le type n'est pas géré
  }
};

// Utilisez la fonction getTypeBackgroundColor pour définir la couleur dynamiquement
const backgroundColor = getTypeBackgroundColor(pokemon.value.typePokemon.type);

const fontStyle = {
  fontFamily: "Pixelify Sans, sans-serif",
};
</script>

<template>
  <div
    v-if="pokemon"
    class="max-w-md mx-auto rounded-md overflow-hidden shadow-md border-4 border-yellow-400 h-full"
    :style="{
      'background-color': backgroundColor,
    }"
  >
    <!-- Metadata for SEO and social media -->
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
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;700&display=swap"
      />
    </Head>

    <!-- PV et Type on the same line -->
    <div class="p-4 flex justify-between items-start">
      <h2 class="text-2xl font-bold" :style="fontStyle">{{ pokemon.nom }}</h2>

      <div class="flex items-center">
        <div class="text-gray-600 mr-4" :style="fontStyle">
          PV: {{ pokemon.pv }}
        </div>
        <NuxtImg
          v-if="pokemon.typePokemon && pokemon.typePokemon.logoType"
          :src="pokemon.typePokemon.logoType.url"
          :alt="pokemon.typePokemon.type"
          class="w-12 h-12 rounded-full"
        />
        <p v-else class="ml-2">Non défini</p>
      </div>
    </div>

    <!-- Image du Pokémon avec un espace autour -->
    <div class="p-4">
      <NuxtImg
        class="w-full h-auto object-cover rounded-md"
        :src="pokemon.image.url"
        :alt="pokemon.nom"
      />
    </div>

    <!-- Attaques avec descriptions et styles différents -->
    <div class="p-4" :style="fontStyle">
      <ul class="list-none list-inside">
        <li>
          <p class="font-bold text-lg">{{ pokemon.attaque1.nom }}</p>
          <p class="text-sm">{{ pokemon.attaque1.description }}</p>
        </li>
        <li class="mt-4">
          <p class="font-bold text-lg">{{ pokemon.attaque2.nom }}</p>
          <p class="text-sm">{{ pokemon.attaque2.description }}</p>
        </li>
      </ul>
    </div>
  </div>

  <div v-else>
    <li>Loading...</li>
  </div>
</template>
