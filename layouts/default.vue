<template>
  <Head>
    <Title>Pokedex Florentin Muraille</Title>
    <Meta
      name="description"
      content="Découvrez des Pokémon uniques avec des informations détaillées et des images générées par intelligence artificielle."
    />
    <Meta
      property="og:description"
      content="Pokedex avec image générée par IA"
    />
    <Meta
      property="og:image"
      content="https://nuxt-hygraph-example.vercel.app/img/pokedex.webp"
    />
    <Meta
      property="og:url"
      content="https://nuxt-hygraph-example.vercel.app/"
    />
    <Meta property="og:type" content="website" />
    <Meta property="og:locale" content="fr_FR" />
    <Meta property="og:site_name" content="Pokedex IA" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" content="@CastorObese" />
    <Meta name="twitter:creator" content="@CastorObese" />
    <Meta name="twitter:title" content="Pokedex IA" />
    <Meta
      name="twitter:description"
      content="Découverte Interactive de Pokémon | Pokedex Complet Alimenté par IA"
    />
    <Meta name="theme-color" content="#DC143C" />
  </Head>

  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat relative"
    style="background-image: url('/images/decor.jpg')"
  >
    <nav class="container mx-auto px-3 h-24 flex items-center mb-10">
      <NuxtLink to="/">
        <h1 class="text-5xl font-serif text-stroke-white">Pokedex</h1>
      </NuxtLink>
    </nav>
    <div class="container mx-auto px-3">
      <slot />
    </div>
  </div>
</template>

<style>
.text-stroke-white {
  color: white;
  -webkit-text-stroke: 1.5px black;
}
</style>
