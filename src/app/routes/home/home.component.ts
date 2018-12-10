import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { map } from 'rxjs/operators';
import { Models } from 'src/app/shared/models';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { FormGroup, FormBuilder } from '@angular/forms';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public heatMap = true;

  public formLocations: FormGroup;

  public locations$ = this.api.select.locations$;

  public locationsVisible$ = combineLatest(this.locations$, this.ui.select.formLocations$).pipe(
    map(result => {
      return {
        locations: result[0].data,
        formValues: result[1],
      };
    }),
    // filter(result => result.locations[]),

    map(result => this.locationsFilter(result)),
  );

  public locations: any[];

  constructor(private api: ApiService, public ui: UIStoreService, private fb: FormBuilder) {}

  public ngOnInit() {
    // Create searchable locations
    this.formLocations = this.fb.group({
      zip: ['', []],
      priceLow: ['', []],
      priceHigh: ['', []],
      bedroomsMin: ['', []],
      bedroomsMax: ['', []],
      homeTypes: ['', []],
      sqFootageMin: ['', []],
      sqFootageMax: ['', []],
      is_single_family: [false, []],
      is_multi_family: [false, []],
      is_townhouse: [false, []],
      is_condo: [false, []],
    });

    this.api.locations.get().subscribe(locations => {
      this.locations = locations.map(location => {
        return <Map.Location>{
          ...location,
          latitude: location.display_lat,
          longitude: location.display_lng,
          metadata: {
            title: location.display_address,
            description: location.city + ' ' + location.county,
          },
        };
      });
    });

    // On intial load, rehydrate form with original values
    this.ui.select.formLocations$
      .subscribe(form => {
        if (form) {
          this.formLocations.patchValue(form);
        }
      })
      .unsubscribe();

    // this.locationsVisible$.subscribe(res => console.warn(res));
  }

  public locationsUpdate() {
    const formValues: Models.LocationsForm = this.formLocations.value;
    this.ui.formLocationChange(formValues);
  }

  /**
   *
   */
  private locationsFilter = (result: { locations: Models.Location[]; formValues: any }) => {
    // console.log(result);
    if (result.locations && result.formValues) {
      return result.locations.filter((location, i) => {
        if (i < 3) {
          // console.log(result.formValues.priceLow, location.price);
        }

        // Zip code check
        if (
          result.formValues.zip.toString() !== '' &&
          location.zip_code.toString() !== result.formValues.zip.toString()
        ) {
          return false;
        }

        // Low price check
        if (result.formValues.priceLow !== '' && location.price < parseInt(result.formValues.priceLow)) {
          return false;
        }

        // Low price check
        if (result.formValues.priceHigh !== '' && location.price > parseInt(result.formValues.priceHigh)) {
          return false;
        }


        // Min bedrooms
        if (result.formValues.bedroomsMin !== '' && location.total_bedrooms < parseInt(result.formValues.bedroomsMin)) {
          return false;
        }

        // Min bedrooms
        if (result.formValues.bedroomsMax !== '' && location.total_bedrooms > parseInt(result.formValues.bedroomsMax)) {
          return false;
        }


        // Home types need to match on ANY, if a single hometype parameter matches then return true
        let hasHomeType = false;

        // Single family
        if (result.formValues.is_single_family !== false && location.is_single_family !== '') {
          hasHomeType = true;
        }

        // Multi-family
        if (result.formValues.is_multi_family !== false && location.is_multi_family !== '') {
          hasHomeType = true;
        }

        // Townhomes
        if (result.formValues.is_townhouse !== false && location.is_townhouse !== '') {
          hasHomeType = true;
        }

        // Condos
        if (result.formValues.is_condo !== false && location.is_condo !== '') {
          hasHomeType = true;
        }

        // If ALL hometypes are false then show all
        if (
          result.formValues.is_single_family === false &&
          result.formValues.is_multi_family === false &&
          result.formValues.is_townhouse === false &&
          result.formValues.is_condo === false
        ) {
          hasHomeType = true;
        }

        if (!hasHomeType) {
          return false;
        }

        return true;
      });
    } else if (result.locations) {
      return result.locations;
    }
  }

  // Must be present even if not used for unsubs
  ngOnDestroy() {}
}
