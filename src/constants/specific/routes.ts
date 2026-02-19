export const ROUTES = {
  PRESENTATION: "/presentation",
  PAINTING: "/peintures",
  SCULPTURE: "/sculptures",
  DRAWING: "/dessins",
  CONTACT: "/contact",
  HOME: "/",
  POST: "/posts",
  ADMIN: "/admin",
  LOGIN: "/login",
  A_PAINTING: "/admin/peintures",
  A_SCULPTURE: "/admin/sculptures",
  A_DRAWING: "/admin/dessins",
  A_HOME: "/admin/home",
  A_POST: "/admin/posts",
  A_CONTACT: "/admin/contact",
  A_PRESENTATION: "/admin/presentation",
  A_META: "/admin/meta",
};

export const TAGS = {
  PRESENTATION: "Présentation",
  PAINTING: "Peintures",
  SCULPTURE: "Sculptures",
  DRAWING: "Dessins",
  HOME: "Home",
  PRIVACY_FRENCH: "Politique de confidentialité",
  ADMIN: "Général",
  POST: "Posts",
  CONTACT: "Contact",
  META: "Métadonnées",
};

export const MENU_1_ITEMS = [
  {
    TAG: TAGS.PAINTING,
    ROUTE: ROUTES.PAINTING,
  },
  {
    TAG: TAGS.SCULPTURE,
    ROUTE: ROUTES.SCULPTURE,
  },
  {
    TAG: TAGS.DRAWING,
    ROUTE: ROUTES.DRAWING,
  },
];

export const MENU_2 = [
  {
    TAG: TAGS.PRESENTATION,
    ROUTE: ROUTES.PRESENTATION,
  },
  {
    TAG: TAGS.HOME,
    ROUTE: ROUTES.HOME,
  },
  {
    TAG: TAGS.CONTACT,
    ROUTE: ROUTES.CONTACT,
  },
];

export const ADMIN_MENU = [
  {
    ROUTE: ROUTES.ADMIN,
    TAG: TAGS.ADMIN,
  },
  {
    ROUTE: ROUTES.A_HOME,
    TAG: TAGS.HOME,
  },
  {
    ROUTE: ROUTES.A_PAINTING,
    TAG: TAGS.PAINTING,
  },
  {
    ROUTE: ROUTES.A_SCULPTURE,
    TAG: TAGS.SCULPTURE,
  },
  {
    ROUTE: ROUTES.A_DRAWING,
    TAG: TAGS.DRAWING,
  },
  {
    ROUTE: ROUTES.A_PRESENTATION,
    TAG: TAGS.PRESENTATION,
  },
  {
    ROUTE: ROUTES.A_CONTACT,
    TAG: TAGS.CONTACT,
  },
  {
    ROUTE: ROUTES.A_META,
    TAG: TAGS.META,
  },
];
