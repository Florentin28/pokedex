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
let isFirstToggle = true; // Ajoutez une variable pour suivre la première transition

const showLargeImage = ref(false);

// Ajoutez une méthode pour basculer l'affichage de l'image en grand
const toggleLargeImage = () => {
  showLargeImage.value = !showLargeImage.value;
};

// Fonction toggleDetails mise à jour
const toggleDetails = () => {
  showDetails.value = !showDetails.value;

  if (showDetails.value && isFirstToggle) {
    updateInfoText();
    document
      .querySelector(".description")
      .classList.add("description-enter-active");
    isFirstToggle = false;
  } else {
    document
      .querySelector(".description")
      .classList.remove("description-enter-active");
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

// Ajoutez cette ligne dans votre script pour gérer la classe fade-enter
const beforeEnter = (el) => {
  el.classList.add("fade-enter");
};
</script>

<template>
  <transition
    name="fade"
    mode="out-in"
    :before-enter="beforeEnter"
    :enter="enter"
    :leave="leave"
  >
    <div
      v-if="showDetails"
      class="card-container description absolute top-1/2 transform -translate-y-1/2 w-96 p-6 bg-white border-4 border-yellow-400 rounded-md shadow-md appear-animation fade-enter fade-enter-to"
      :style="{
        left: '50%',
        'max-height': '100vh',
        'overflow-y': 'auto',

        transition: 'opacity 1s, transform 1s ease-in-out',
      }"
    >
      <div class="text-justify">
        <h3 class="text-lg font-bold mb-2">Description</h3>
        <p :class="{ tada: showDetails }">{{ infoText }}</p>
       
        <p class="mb-2">
          <strong class="font-bold text-lg">
            {{ pokemon.attaque1.nom }} - {{ pokemon.attaque1.degats }}
          </strong>
        </p>
        <p class="text-sm mb-4">{{ pokemon.attaque1.description }}</p>
        <p class="mb-2">
          <strong class="font-bold text-lg">
            {{ pokemon.attaque2.nom }} - {{ pokemon.attaque2.degats }}
          </strong>
        </p>
        <p class="text-sm">{{ pokemon.attaque2.description }}</p>
         <p class="mt-4"><strong>Taille :</strong> {{ pokemon.taille }} cm</p>
        <p class="mb-2">
        <p><strong>Poids :</strong> {{ pokemon.poids }} kg</p>
        </p>
      </div>
    </div>
  </transition>

  <div
    v-if="pokemon"
    class="card-container relative max-w-md mx-auto rounded-md overflow-hidden shadow-md border-4 border-yellow-400 h-full"
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
    <div class="p-4" @click="toggleLargeImage">
      <NuxtImg
        class="w-full h-auto object-cover rounded-md cursor-pointer transition-transform transform hover:brightness-125 appear-animation"
        :src="pokemon.image.url"
        :alt="pokemon.nom"
      />
    </div>

    <!-- Attaques avec descriptions et styles différents -->
    <div class="p-4" :style="fontStyle">
      <ul class="list-none list-inside">
        <li>
          <p class="font-bold text-lg">
            {{ pokemon.attaque1.nom }} - {{ pokemon.attaque1.degats }}
          </p>
        </li>
        <li class="mt-4">
          <p class="font-bold text-lg">
            {{ pokemon.attaque2.nom }} - {{ pokemon.attaque2.degats }}
          </p>
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

  <!-- Affiche l'image en grand si showLargeImage est true -->
  <div
    v-if="showLargeImage"
    class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center"
  >
    <!-- Bouton pour revenir en arrière -->
    <button
      @click="toggleLargeImage"
      class="absolute top-20 left-64 px-6 py-2.5 text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg text-sm"
    >
      Retour
    </button>
    <div class="max-w-full max-h-full overflow-hidden">
      <NuxtImg
        class="w-full h-auto object-cover rounded-md cursor-pointer transition-transform transform hover:scale-120 border-4 border-yellow-400"
        :src="pokemon.image.url"
        :alt="pokemon.nom"
      />
    </div>
  </div>

  <div v-else>
    <li>Loading...</li>
  </div>
</template>

<style>
/* Cette partie gère l'état initial de l'élément (opacity: 0) et la transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out, transform 1s ease-in-out;
}

/* Cette partie gère l'opacité active pendant l'apparition (entrée) */
.fade-enter-active {
  opacity: 0;
}

/* Cette partie gère l'opacité active pendant la sortie (quand l'élément est supprimé) */
.fade-leave-active {
  opacity: 0;
}
.card-container {
  height: 100%;
  top: 50%;
  transform: translateY(-42%);
}
</style>
