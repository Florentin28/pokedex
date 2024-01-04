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

// Ajoutez cette ligne pour déclarer une variable de données
const showDetails = ref(false);

// Modifiez cette fonction pour basculer l'état de showDetails et mettre à jour le texte
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
  if (showDetails.value) {
    updateInfoText(); // Ajoutez cet appel pour mettre à jour le texte
  }
};

// Ajoutez une nouvelle donnée pour stocker le texte de la zone d'information
const infoText = ref("test jidhjkfk");
console.log("infoText initial :", infoText.value);

// Ajoutez une méthode pour mettre à jour le contenu de la zone d'information
const updateInfoText = () => {
  // Mettez à jour le texte en fonction de vos besoins
  infoText.value = pokemon.value.description;
  console.log("updateInfoText appelée, infoText mis à jour :", infoText.value);
};
</script>

<template>
  <!-- Zone de texte pour les informations -->
  <div
    v-if="showDetails"
    class="absolute top-1/2 transform -translate-y-1/2 w-72 p-6 bg-white border-l-4 border-yellow-400 shadow-md transition duration-150 ease-in-out"
    :style="{ left: '50%', 'max-height': '80vh', 'overflow-y': 'auto' }"
  >
    <div class="text-justify">
      <p>{{ infoText }}</p>
    </div>
  </div>
  <div
    v-if="pokemon"
    class="relative max-w-md mx-auto rounded-md overflow-hidden shadow-md border-4 border-yellow-400 h-full"
    :style="{
      'background-color': backgroundColor,
      transform: showDetails ? 'translateX(-80%)' : 'translateX(0)',
      transition: 'transform 1.5s ease-in-out',
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
    <!-- Bouton "informations" -->
    <button
      @click="toggleDetails"
      class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue flex items-center ml-32 mb-4"
    >
      {{ showDetails ? "Masquer informations" : "Afficher informations" }}
    </button>
  </div>

  <div v-else>
    <li>Loading...</li>
  </div>
</template>
