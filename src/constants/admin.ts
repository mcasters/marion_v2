export const THEME = {
  BASE_THEME: "Thème de base",
};

export const THEME_LABEL = {
  general: "Général",
  home: "Page home",
  work: "Pages des œuvres",
  other: "Autres pages",
};

export const THEME_PAGE_LABEL = {
  menu1: "Menu 1",
  menu2: "Menu 2",
  main: "Corps de page",
  footer: "Pied de page",
};

export const THEME_GEN_TARGET_LABEL = {
  lineColor: "Ligne au top",
  titleColor: "Titre du site",
  lightbox: "Fond de la lightbox",
  lightboxText: "Texte de la lightbox",
};

export const THEME_TARGET_LABEL = {
  background: "Fond",
  text: "Texte",
  link: "Lien",
  linkHover: "Lien pointé*",
};

export const COOKIE_NAME = "adminSession";

export const META = {
  SITE_TITLE: "siteTitle",
  SITE_EMAIL: "siteEmail",
  FOOTER: "footerContent",
  INSTAGRAM: "instagram",
  PAINTING_LAYOUT: "paintingLayout",
  SCULPTURE_LAYOUT: "sculptureLayout",
  DRAWING_LAYOUT: "drawingLayout",
  HOME_LAYOUT: "homeLayout",

  SEO_SITE_TITLE: "seoSiteTitle",
  URL: "url",
  KEYWORDS: "keywords",

  DOCUMENT_TITLE_HOME: "documentTitleHome",
  DESCRIPTION_HOME: "descriptionHome",

  DOCUMENT_TITLE_PAINTING_HOME: "documentTitlePaintingHome",
  DESCRIPTION_PAINTING_HOME: "descriptionPaintingHome",
  DOCUMENT_TITLE_PAINTING: "documentTitlePainting",
  DESCRIPTION_PAINTING: "descriptionPainting",

  DOCUMENT_TITLE_SCULPTURE_HOME: "documentTitleSculptureHome",
  DESCRIPTION_SCULPTURE_HOME: "descriptionSculptureHome",
  DOCUMENT_TITLE_SCULPTURE: "documentTitleSculpture",
  DESCRIPTION_SCULPTURE: "descriptionSculpture",

  DOCUMENT_TITLE_DRAWING_HOME: "documentTitleDrawingHome",
  DESCRIPTION_DRAWING_HOME: "descriptionDrawingHome",
  DOCUMENT_TITLE_DRAWING: "documentTitleDrawing",
  DESCRIPTION_DRAWING: "descriptionDrawing",

  DOCUMENT_TITLE_POST: "documentTitlePost",
  DESCRIPTION_POST: "descriptionPost",

  DOCUMENT_TITLE_PRESENTATION: "documentTitlePresentation",
  DESCRIPTION_PRESENTATION: "descriptionPresentation",

  DOCUMENT_TITLE_CONTACT: "documentTitleContact",
  DESCRIPTION_CONTACT: "descriptionContact",
};

export const SEO: { [key: string]: string } = {
  [META.SEO_SITE_TITLE]: "Titre du site",
  [META.URL]: "Url du site",
  [META.KEYWORDS]: "Mots clés",

  [META.DOCUMENT_TITLE_HOME]: "Titre de la page home",
  [META.DESCRIPTION_HOME]: "Description de la page home",

  [META.DOCUMENT_TITLE_PAINTING_HOME]:
    "Titre de la page d'accueil des peintures",
  [META.DESCRIPTION_PAINTING_HOME]:
    "Description de la page d'accueil des peintures",
  [META.DOCUMENT_TITLE_PAINTING]: "Titre de la page peintures",
  [META.DESCRIPTION_PAINTING]: "Description de la page peintures",

  [META.DOCUMENT_TITLE_SCULPTURE_HOME]:
    "Titre de la page d'accueil des sculptures",
  [META.DESCRIPTION_SCULPTURE_HOME]:
    "Description de la page d'accueil des sculptures",
  [META.DOCUMENT_TITLE_SCULPTURE]: "Titre de la page sculptures",
  [META.DESCRIPTION_SCULPTURE]: "Description de la page sculptures",

  [META.DOCUMENT_TITLE_DRAWING_HOME]: "Titre de la page d'accueil des dessins",
  [META.DESCRIPTION_DRAWING_HOME]:
    "Description de la page d'accueil des dessins",
  [META.DOCUMENT_TITLE_DRAWING]: "Titre de la page dessins",
  [META.DESCRIPTION_DRAWING]: "Description de la page dessins",

  [META.DOCUMENT_TITLE_POST]: "Titre de la page posts",
  [META.DESCRIPTION_POST]: "Description de la page posts",

  [META.DOCUMENT_TITLE_PRESENTATION]: "Titre de la page présentation",
  [META.DESCRIPTION_PRESENTATION]: "Description de la page présentation",

  [META.DOCUMENT_TITLE_CONTACT]: "Titre de la page contact",
  [META.DESCRIPTION_CONTACT]: "Description de la page contact",
};

export const MESSAGE = {
  category:
    "Une catégorie ne peut être supprimée que lorsqu'il n'y a pas ou plus d'item qui y est classé.",
  categoryImage:
    "Parmi les renseignements facultatif d'une catégorie, en plus d'un descriptif, la photo d'une" +
    " œuvre peut être assignée à cette catégorie, cela permet à l'utilisateur d'avoir une idée du genre d'œuvre qui s'y trouve (cette photo s'affiche dans la pastille sur laquelle on clique pour voir les œuvres de la catégorie). Cependant, cette photo ne peut être ajoutée qu'une fois que des œuvres y sont classées, puisque le choix de la photo s'effectue parmi ces œuvres. Donc après avoir créé la catégorie, et après y avoir classé des œuvres, tu pourras alors choisir une photo en allant dans la mise à jour de la catégorie.",
  error_sizeUpload:
    "La taille totale des fichiers excède la limite de sécurité (30 MB).\nAjouter moins de fichier à" +
    " la fois.",
  error_imageSize:
    "Dimension de l'image trop petite. Largeur minimum : 2000 pixels",
};
