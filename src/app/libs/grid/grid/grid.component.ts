import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions, ColumnApi, ColDef } from 'ag-grid-community';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { debounce } from 'helpful-decorators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { GridTemplateRendererComponent } from '../grid-template-renderer/grid-template-renderer.component';
import { GridStatusBarComponent } from '../grid-status-bar/grid-status-bar.component';
import { GridColumnDirective } from '../directives/column.directive';

const defaultsDeep = require('lodash/defaultsDeep');

@AutoUnsubscribe()
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: [
    '../../../../../node_modules/ag-grid-community/dist/styles/ag-grid.css',
    '../../../../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css',
    './grid.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('grid') grid: AgGridNg2;
  @ViewChild('gridContainer') gridContainer: ElementRef;

  @Input() parentRef: any;
  /** Hold and set default options for grid*/
  private _gridOptions: GridOptions = {
    context: {
      // this: this.parentRef,
    },
    // A default column definition with properties that get applied to every column
    defaultColDef: {
      width: 150, // Set every column width
      editable: false, // Make every column editable
      enableRowGroup: true, // Make every column groupable
      filter: 'agTextColumnFilter', // Make every column use 'text' filter by default
    },
    statusBar: {
      statusPanels: [{ statusPanel: 'statusBarComponent', align: 'left', key: 'statusBarComponent' }],
    },
  };
  @Input()
  set gridOptions(options: GridOptions) {
    this._gridOptions = defaultsDeep(this._gridOptions, options);
  }
  get gridOptions() {
    return this._gridOptions;
  }

  @Input()
  set gridFilterTerm(term: string) {
    if (this.grid && this.grid.api) {
      this.grid.api.setQuickFilter(term);
    }
  }

  private _gridState: GridState = {
    columns: [],
    sorts: [],
    filters: {},
  };
  @Input()
  set gridState(gridState: GridState) {
    this._gridState = {
      ...this._gridState,
      ...gridState,
    };
  }
  get gridState() {
    return this._gridState;
  }

  @Input() rowData: any[];
  @Input() getMainMenuItems: any;
  @Input() columnDefs: ColDef[];
  @Input() animateRows: boolean;
  @Input() enableSorting: boolean;
  @Input() enableFilter: boolean;
  @Input() enableColResize: boolean;
  @Input() enableRangeSelection: boolean;
  @Input() rememberGroupStateWhenNewData: any;
  @Input() groupUseEntireRow: boolean;
  @Input() getContextMenuItems: any;
  @Input() frameworkComponents: any;
  @Input() rowGroupPanelShow: any;
  @Input() rowSelection: any;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowsSelected = new EventEmitter<any[]>();

  public gridColumnApi: ColumnApi;
  public gridLoaded: boolean;
  public gridAllowUpdate = true;
  public gridComponents = { statusBarComponent: GridStatusBarComponent };
  public gridStatusComponent: GridStatusBarComponent;

  private columnsDefault: ColDef[];

  /** Holds custom DOM templates passed from parent */
  private _columnTemplates: any;
  @ContentChildren(GridColumnDirective)
  set columnTemplates(val: QueryList<GridColumnDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      this._columnTemplates = arr;
    }
  }
  get columnTemplates(): QueryList<GridColumnDirective> {
    return this._columnTemplates;
  }

  constructor() {}

  ngOnInit() {
    this.gridOptions.context = this.parentRef;
    // On window resize event, fit the grid columns to the screen
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        if (this.gridLoaded && this.gridColumnApi) {
          this.gridFit();
        }
      });
  }

  ngOnChanges(model: any) {
    if (model.columnDefs && model.columnDefs.currentValue) {
      this.columnsDefault = this.columnsSaveDefaults(model.columnDefs.currentValue);
    }
  }

  /**
   * When the grid is ready and has finished loading
   * @param params
   */
  public gridReady(params: any) {
    this.gridColumnApi = params.columnApi;
    // Set reference to status component so state can be pushed
    this.gridStatusComponent = (<any>this).gridOptions.api
      .getStatusPanel('statusBarComponent')
      .getFrameworkComponentInstance();
    // Attach reset method to status component so the status method
    this.gridStatusComponent.reset = this.gridReset.bind(this);
    // Grid is ready, restore default state if any
    this.gridStateRestore();
    // Attach templates
    this.templatesAttach();
  }

  /** After the grid has loaded data */
  public gridFirstDataRendered() {
    this.gridLoaded = true;
    this.gridFit();
  }

  /** Have the columns fill the available space if less than grid width */
  public gridFit() {
    if (this.gridColumnApi && this.gridContainer && this.gridContainer.nativeElement) {
      const widthCurrent = this.gridColumnApi.getColumnState().reduce((a, b) => a + b.width, 0);
      const widthGrid = this.gridContainer.nativeElement.offsetWidth;
      if (widthCurrent < widthGrid && this.gridAllowUpdate && this.gridLoaded) {
        // Disable allow update to prevent loop
        this.gridAllowUpdate = false;
        // Resize columns to fit screen
        this.grid.api.sizeColumnsToFit();
      }
    }
  }

  /** When the grid is resized */
  @debounce(100, {
    leading: false,
    trailing: true,
  })
  public gridSizeChanged() {
    // console.log('Grid Resized')
  }

  /**
   * Get selected rows out of the datagrid
   * @param event
   */
  public gridSelectionChanged() {
    const rows = this.grid.api.getSelectedNodes().map(node => node.data);
    this.rowsSelected.emit(rows);
  }

  /** Reset the grid state */
  public gridReset() {
    this.gridAllowUpdate = false;
    this.grid.api.setSortModel(null);
    this.grid.api.setFilterModel(null);
    this.gridColumnApi.resetColumnState();
    this.getGridState();
    this.gridStatusComponent.gridStateChange(this.gridState);
    this.gridAllowUpdate = true;
    this.gridFit();
  }

  /**
   * On grid state changes such as sorting, filtering and grouping
   * Added debounce since some events fire quickly like resizing
   * @param $event
   */
  @debounce(100, {
    leading: false,
    trailing: true,
  })
  public gridStateChanged($event: any) {
    // console.log('gridStateChanged', $event.type, this.gridAllowUpdate);
    if (this.gridAllowUpdate) {
      this.getGridState();

      if ($event.type === 'columnResized') {
        this.gridFit();
      }

      // Only save state after grid has been fully loaded
      if (this.gridLoaded) {
        // Pass gridstate to status component
        this.gridStatusComponent.gridStateChange(this.gridState);
      }
    }
    this.gridAllowUpdate = true;
  }

  /** Get grid state and emit to parent */
  public getGridState() {
    this.gridState = {
      columns: this.columnStateRestore(this.columnsDefault, this.gridColumnApi.getColumnState()),
      sorts: this.grid.api.getSortModel(),
      filters: this.grid.api.getFilterModel(),
    };
    this.stateChange.emit(this.gridState);
  }

  /** Restore the grid state */
  public gridStateRestore() {
    if (this.grid && this.gridColumnApi) {
      if (this.gridState.columns) {
        this.gridColumnApi.setColumnState(this.gridState.columns);
      }
      if (this.gridState.sorts) {
        this.grid.api.setSortModel(this.gridState.sorts);
      }
      if (this.gridState.filters) {
        this.grid.api.setFilterModel(this.gridState.filters);
        this.grid.api.onFilterChanged();
      }
      // If restoring gridstate, update status component
      this.gridStatusComponent.gridStateChange(this.gridState);
    }
  }

  /** When data in the grid changes */
  public gridRowDataChanged() {
    // Whenever data is loaded into the grid the filters are wiped out. Check if filters are present and reload them
    if (this.gridState.filters) {
      this.grid.api.setFilterModel(this.gridState.filters);
      this.grid.api.onFilterChanged();
    }
  }

  /**
   * Extracts custom cell/header templates from projected content and attaches it to the ag-grid renderer
   */
  public templatesAttach() {
    // Make sure columns and column templates are present
    if (this.columnDefs && this.columnTemplates && this.columnTemplates.length) {
      // Loop through all custom templates
      this.columnTemplates.forEach(template => {
        // Loop through all columns
        for (let i = 0; i <= this.columnDefs.length - 1; i++) {
          const column = this.columnDefs[i];
          // If column field matches custom template, attach custom tempalte
          if (column.field === template.field) {
            column.cellRendererFramework = GridTemplateRendererComponent;
            column.cellRendererParams = {
              ngTemplate: template.templateCell,
            };
            break; // Stop loop
          }
        }
      });
      // Update column definitions after done
      this.grid.api.setColumnDefs(this.columnDefs);
    }
  }

  /**
   * Returns the full complete column definitions which contain properties AG grid removed.
   * AG grid mutates the column definitions and removes key properies like field and headerName.
   * This method returns a mashup of both the original and modified column definitions.
   * @param colsDefault - Original column defs with properties of "field" and "headerName"
   * @param colsModified - Modified column def with properties of "colId" etc
   */
  private columnStateRestore(colsDefault: ColDef[], colsModified: ColDef[]): ColDef[] {
    if (colsDefault && colsModified) {
      const colsOriginal = [...colsDefault];
      // Loop through the modified columns
      return colsModified.map(column => {
        // Now loop through the default/original input columns
        for (let i = 0; i <= colsDefault.length; i++) {
          // Check if the field name in the original matches the colID in the modified
          if (colsOriginal[i].field === column.colId) {
            // Remove the matched item out of the original array to cut future loops down
            // colsOriginal = [...colsOriginal.slice(0, i), ...colsOriginal.slice(i + 1)];
            // Return the column def which is a mashup of both objects
            return {
              ...colsOriginal[i],
              ...column,
            };
          }
        }
      });
    }
    return colsModified;
  }

  /**
   * Save the original column definitions
   * AG grid mutates the original input columns and destroys a lot of data
   * @param columns
   */
  private columnsSaveDefaults(columns: ColDef[]): ColDef[] {
    // Make sure data exists
    if (columns && columns.length) {
      return this.columnDefs.map(column => {
        return { ...column };
      });
    }
    return null;
  }

  ngOnDestroy() {}
}
