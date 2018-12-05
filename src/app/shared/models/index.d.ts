/**
 * Generate models with NSwagStudio: https://github.com/RSuter/NSwag/wiki/NSwagStudio
 * Make sure to point at the docs url in the top green header
 * IE http://localhost:57462/swagger/docs/v1
 * NOT http://localhost:57462/swagger/ui/index#/

 Config Options:
  - Set namespace to Models
  - TS version 2.7
  - Generate DTO types: Checked
  - Type Style: Interface
  - Null Value: Null
  - Leave everything else blank or unchecked here

 */

export declare namespace Models {
  /** Initial environment settings received from web api*/
  interface EnvSettings {
    ApiUrl: string;
    ApiNamespace: string;
    SignalRUrl: string;
  }

  export interface Location {
    property_id: number;
    display_lat: number;
    display_lng: number;
    display_address: string;
    city: string;
    county: string;
    zip_code: number;
    listing_price: string;
    total_bedrooms: number;
    total_bathrooms: string;
    is_single_family: string;
    is_multi_family: string;
    is_condo: string;
    is_condo_townhouse: string;
    is_townhouse: string;
    is_lot: string;
    square_feet: number;
    days_on_market: number;
    lot_dimension: string;
    hoa_fee: string;
    year_built: number;
    listing_status: string;
    listing_status_standardized: string;
  }

  export interface User {
    id: number;
    name?: string;
    username: string;
    email?: string;
    address?: {
      street?: string;
      suite?: string;
      city?: string;
      zipcode?: string;
      geo?: {
        lat?: string;
        lng?: string;
      };
    };
    phone?: string;
    website?: string;
    company?: {
      name?: string;
      catchPhrase?: string;
      bs?: string;
    };
  }
}
