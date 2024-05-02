import type { Schema, Attribute } from '@strapi/strapi';

export interface ContactAddress extends Schema.Component {
  collectionName: 'components_contact_addresses';
  info: {
    displayName: 'Address';
    icon: 'house';
    description: '';
  };
  attributes: {
    street: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 50;
      }>;
    local: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 10;
      }>;
    city: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 50;
      }>;
    postal: Attribute.String & Attribute.Required;
  };
}

export interface ContactPersonal extends Schema.Component {
  collectionName: 'components_contact_personals';
  info: {
    displayName: 'Personal';
    icon: 'emotionHappy';
  };
  attributes: {
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 50;
      }>;
  };
}

export interface ContactPhone extends Schema.Component {
  collectionName: 'components_contact_phones';
  info: {
    displayName: 'Phone';
    icon: 'phone';
    description: '';
  };
  attributes: {};
}

export interface DeliveryDeliveryMethod extends Schema.Component {
  collectionName: 'components_delivery_delivery_methods';
  info: {
    displayName: 'DeliveryMethod';
    icon: 'car';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    price: Attribute.Decimal & Attribute.Required;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    icon: 'write';
    description: '';
  };
  attributes: {
    header: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 50;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    footerImage: Attribute.Media & Attribute.Required;
  };
}

export interface OrderItem extends Schema.Component {
  collectionName: 'components_order_items';
  info: {
    displayName: 'Item';
    icon: 'television';
  };
  attributes: {
    count: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 100;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    product: Attribute.Relation<
      'order.item',
      'oneToOne',
      'api::product.product'
    >;
  };
}

export interface PagePropertiesMetaTag extends Schema.Component {
  collectionName: 'components_page_properties_meta_tags';
  info: {
    displayName: 'MetaTag';
    icon: 'earth';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    content: Attribute.Text & Attribute.Required;
  };
}

export interface PagePropertiesSeo extends Schema.Component {
  collectionName: 'components_page_properties_seos';
  info: {
    displayName: 'SEO';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Bizzare Jelly'>;
    metaDescription: Attribute.Text & Attribute.Required;
    metaTag: Attribute.Component<'page-properties.meta-tag', true>;
  };
}

export interface PageSectionsArrivalsSection extends Schema.Component {
  collectionName: 'components_page_sections_arrivals_sections';
  info: {
    displayName: 'ArrivalsSection';
    icon: 'seed';
    description: '';
  };
  attributes: {
    header: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 50;
      }>;
    newProducts: Attribute.Relation<
      'page-sections.arrivals-section',
      'oneToMany',
      'api::product.product'
    >;
  };
}

export interface PageSectionsHeroSection extends Schema.Component {
  collectionName: 'components_page_sections_hero_sections';
  info: {
    displayName: 'HeroSection';
    icon: 'crown';
    description: '';
  };
  attributes: {
    header: Attribute.Text & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    CTA: Attribute.String;
    heroImage: Attribute.Media & Attribute.Required;
  };
}

export interface PaymentPaymentMethod extends Schema.Component {
  collectionName: 'components_payment_payment_methods';
  info: {
    displayName: 'PaymentMethod';
    icon: 'handHeart';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    icon: Attribute.String & Attribute.Required;
  };
}

export interface ProductCategory extends Schema.Component {
  collectionName: 'components_product_categories';
  info: {
    displayName: 'Category';
    icon: 'bulletList';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
  };
}

export interface ProductPriceRange extends Schema.Component {
  collectionName: 'components_product_price_ranges';
  info: {
    displayName: 'PriceRange';
    icon: 'database';
  };
  attributes: {
    index: Attribute.Integer & Attribute.Required;
    min: Attribute.Decimal & Attribute.Required;
    max: Attribute.Decimal & Attribute.Required;
  };
}

export interface ProductSortingOption extends Schema.Component {
  collectionName: 'components_product_sorting_options';
  info: {
    displayName: 'SortingOption';
    icon: 'filter';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    field: Attribute.Enumeration<['name', 'price', 'createdAt']>;
    type: Attribute.Enumeration<['asc', 'desc']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'contact.address': ContactAddress;
      'contact.personal': ContactPersonal;
      'contact.phone': ContactPhone;
      'delivery.delivery-method': DeliveryDeliveryMethod;
      'layout.footer': LayoutFooter;
      'order.item': OrderItem;
      'page-properties.meta-tag': PagePropertiesMetaTag;
      'page-properties.seo': PagePropertiesSeo;
      'page-sections.arrivals-section': PageSectionsArrivalsSection;
      'page-sections.hero-section': PageSectionsHeroSection;
      'payment.payment-method': PaymentPaymentMethod;
      'product.category': ProductCategory;
      'product.price-range': ProductPriceRange;
      'product.sorting-option': ProductSortingOption;
    }
  }
}
