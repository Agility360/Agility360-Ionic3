/*------------------------------------------------------
 * written by: mcdaniel
 * date: august 2017
 *
 * usage: data structures for Wordpress provider.
 *        see: https://developer.wordpress.org/rest-api/
 *------------------------------------------------------*/
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: object;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: string;
  content: object;
  excerpt: object;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: object;
  categories: number[];
  tags: object;
  _links: object;
  curies: object[];
  featured_media_obj: object;
  featured_media_url: string;
  candidate_application_date: string;     /* added march-2018. only applicable to Jobs Postings. value from agility API. */

}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: object;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: string;
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: object[];
  description: object;
  caption: object;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: object;
  post: number;
  source_url: string;
  _links: object;
}

export interface WPCategories {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: object;
}
