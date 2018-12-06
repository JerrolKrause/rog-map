import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { ApiService } from '$api';
import { UIStoreService } from '$ui';
import { map, filter } from 'rxjs/operators';
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
  public heatMap = false;

  public formLocations: FormGroup;

  public locations$ = this.api.select.locations$;

  public locationsVisible$ = combineLatest(this.locations$, this.ui.select.formLocations$).pipe(
    map(result => {
      return {
        locations: result[0].data,
        formValues: result[1],
      };
    }),
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
    this.ui.select.formLocations$.subscribe(form => this.formLocations.patchValue(form)).unsubscribe();

    this.locationsVisible$.subscribe(res => console.warn(res));
  }

  public locationsUpdate() {
    const formValues: Models.LocationsForm = this.formLocations.value;
    this.ui.formLocationChange(formValues);
  }

  /**
   *
   */
  private locationsFilter = (result: { locations: Models.Location[]; formValues: any }) => {
    if (result.locations) {
      return result.locations.filter((location, i) => {
         if ( i < 3) {
          console.log(result.formValues.priceLow, location.price);
        }

        // Zip code check
        if (result.formValues.zip.toString() !== '' && location.zip_code.toString() !== result.formValues.zip.toString()) {
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

        return true;
      });
    }
  }

  // Must be present even if not used for unsubs
  ngOnDestroy() {}
}
