# Grid Table Editor App.html Comprehensive Test Plan

## Application Overview

A comprehensive test plan for the Grid Table Editor application (app.html) - a web-based data grid editor with multi-format import/export capabilities, test data generation, and extensive editing features. The application provides a tabulated interface for creating, editing, and converting data between various formats including Markdown, CSV, JSON, XML, SQL, HTML, and more.

## Test Scenarios

### 1. Grid Basic Operations

**Seed:** `tests/browser/seed/basic-setup.spec.ts`

#### 1.1. Add Single Row

**File:** `tests/browser/grid-operations/add-single-row.spec.ts`

**Steps:**
  1. Navigate to http://localhost:8000/app.html
    - expect: Page loads successfully
    - expect: Grid is visible
    - expect: Toolbar buttons are present
  2. Click 'Add Row' button
    - expect: A new empty row is added to the grid
    - expect: Grid displays the new row
    - expect: Row count increases by 1
  3. Click in the new row's cell and enter text 'Test Data'
    - expect: Cell becomes editable
    - expect: Text is entered successfully
    - expect: Cell content is saved

#### 1.2. Add Multiple Rows

**File:** `tests/browser/grid-operations/add-multiple-rows.spec.ts`

**Steps:**
  1. Click 'Add Rows Above' button
    - expect: New row is added above current selection
    - expect: Grid reorders properly
  2. Click 'Add Rows Below' button
    - expect: New row is added below current selection
    - expect: Grid maintains proper order
  3. Add multiple rows and verify positioning
    - expect: All rows are added in correct positions
    - expect: Grid layout remains intact

#### 1.3. Delete Rows

**File:** `tests/browser/grid-operations/delete-rows.spec.ts`

**Steps:**
  1. Select a single row by clicking on it
    - expect: Row is highlighted/selected
    - expect: Delete button becomes enabled
  2. Click 'Delete Selected Rows' button
    - expect: Selected row is removed
    - expect: Other rows remain intact
    - expect: Grid updates properly
  3. Select multiple rows using Ctrl+click
    - expect: Multiple rows are selected
    - expect: Selection indicators are visible
  4. Delete multiple selected rows
    - expect: All selected rows are removed
    - expect: Remaining rows maintain correct order

#### 1.4. Reset Table

**File:** `tests/browser/grid-operations/reset-table.spec.ts`

**Steps:**
  1. Add several rows with data
    - expect: Grid contains multiple rows with content
  2. Click 'Reset Table' button
    - expect: All data is cleared
    - expect: Grid returns to initial state
    - expect: Only default column remains

### 2. Column Operations

**Seed:** `tests/browser/seed/column-setup.spec.ts`

#### 2.1. Add Columns

**File:** `tests/browser/column-operations/add-columns.spec.ts`

**Steps:**
  1. Click on column header to reveal column controls
    - expect: Column control buttons are visible
    - expect: Controls show: [<+] [~] [x] [+=] [+>]
  2. Click '[<+] Add Column Left' control
    - expect: New column is added to the left of current column
    - expect: All data shifts right appropriately
  3. Click '[+>] Add Column Right' control
    - expect: New column is added to the right of current column
    - expect: Existing data remains intact

#### 2.2. Rename Column

**File:** `tests/browser/column-operations/rename-column.spec.ts`

**Steps:**
  1. Click '[~] Rename Column' control
    - expect: Column rename interface appears
    - expect: Current column name is editable
  2. Enter new column name 'New Column Name'
    - expect: Column header updates with new name
    - expect: Change is reflected in export formats

#### 2.3. Delete Column

**File:** `tests/browser/column-operations/delete-column.spec.ts`

**Steps:**
  1. Add data to multiple columns
    - expect: Grid has multiple columns with data
  2. Click '[x] Delete Column' control on a specific column
    - expect: Target column is removed
    - expect: Data in other columns remains intact
    - expect: Grid layout adjusts properly

#### 2.4. Duplicate Column

**File:** `tests/browser/column-operations/duplicate-column.spec.ts`

**Steps:**
  1. Add data to a column
    - expect: Column contains sample data
  2. Click '[+=] Duplicate Column' control
    - expect: New column is created with identical data
    - expect: Original column remains unchanged
    - expect: Both columns are independently editable

### 3. Filtering and Sorting

**Seed:** `tests/browser/seed/filter-sort-setup.spec.ts`

#### 3.1. Global Filter

**File:** `tests/browser/filtering-sorting/global-filter.spec.ts`

**Steps:**
  1. Add multiple rows with varied data (e.g., 'Apple', 'Banana', 'Cherry')
    - expect: Grid contains diverse data across multiple rows
  2. Enter 'App' in the global Filter textbox
    - expect: Only rows containing 'App' are displayed
    - expect: Other rows are hidden
    - expect: Filter is case-insensitive
  3. Clear the filter text
    - expect: All rows become visible again
    - expect: Original data is preserved

#### 3.2. Column Specific Filter

**File:** `tests/browser/filtering-sorting/column-filter.spec.ts`

**Steps:**
  1. Click the filter icon on a column header
    - expect: Column filter searchbox appears
    - expect: Filter interface is activated
  2. Enter filter criteria in the column searchbox
    - expect: Only matching rows in that specific column are displayed
    - expect: Other columns' data is preserved
  3. Apply different filter to another column
    - expect: Multiple column filters work together
    - expect: Results show intersection of all filters

#### 3.3. Column Sorting

**File:** `tests/browser/filtering-sorting/column-sorting.spec.ts`

**Steps:**
  1. Click 'Sort Asc' arrow in column header
    - expect: Column data is sorted in ascending order
    - expect: Sort indicator is visible
    - expect: Other columns maintain row relationships
  2. Click 'Sort Desc' arrow in same column
    - expect: Column data is sorted in descending order
    - expect: Sort direction indicator changes
  3. Click 'Clear Sort' (x) control
    - expect: Column returns to original order
    - expect: Sort indicators are removed

#### 3.4. Clear All Filters

**File:** `tests/browser/filtering-sorting/clear-filters.spec.ts`

**Steps:**
  1. Apply global filter and multiple column filters
    - expect: Multiple filters are active
    - expect: Grid shows filtered results
  2. Click 'Clear Filters' button
    - expect: All filters are removed
    - expect: All data becomes visible
    - expect: All filter inputs are cleared

### 4. Import Export Basic

**Seed:** `tests/browser/seed/import-export-setup.spec.ts`

#### 4.1. Set Text From Grid

**File:** `tests/browser/import-export/set-text-from-grid.spec.ts`

**Steps:**
  1. Add sample data to the grid (multiple rows and columns)
    - expect: Grid contains structured data
  2. Select CSV format tab if not already selected
    - expect: CSV tab is active
    - expect: CSV options are visible
  3. Click 'Set Text From Grid' button
    - expect: Text area is populated with CSV formatted data
    - expect: Data matches grid content
    - expect: Headers are included if option is enabled

#### 4.2. Set Grid From Text

**File:** `tests/browser/import-export/set-grid-from-text.spec.ts`

**Steps:**
  1. Clear the grid and enter valid CSV data in the text area
    - expect: Text area contains properly formatted CSV
    - expect: Set Grid From Text button is enabled
  2. Click 'Set Grid From Text' button
    - expect: Grid is populated with data from text area
    - expect: Columns are created automatically
    - expect: Data types are preserved
  3. Test with malformed CSV data
    - expect: Error handling displays appropriate message
    - expect: Grid state is not corrupted

#### 4.3. CSV File Upload

**File:** `tests/browser/import-export/csv-file-upload.spec.ts`

**Steps:**
  1. Click on CSV file input 'Choose File' button
    - expect: File picker dialog opens
  2. Select a valid CSV file
    - expect: File is loaded successfully
    - expect: Grid is populated with file data
    - expect: Import progress indicator shows completion
  3. Test with invalid file format
    - expect: Appropriate error message is displayed
    - expect: Grid remains in previous state

#### 4.4. CSV Download

**File:** `tests/browser/import-export/csv-download.spec.ts`

**Steps:**
  1. Populate grid with sample data
    - expect: Grid contains exportable data
  2. Click 'CSV Download' button
    - expect: Download is triggered
    - expect: File contains correct CSV data
    - expect: Filename is appropriate

#### 4.5. Drag and Drop Import

**File:** `tests/browser/import-export/drag-drop-import.spec.ts`

**Steps:**
  1. Drag a valid CSV file onto the 'Drag And Drop CSV File Here' zone
    - expect: Drop zone responds to drag event
    - expect: Visual feedback indicates valid drop target
  2. Drop the CSV file in the drop zone
    - expect: File is processed successfully
    - expect: Grid is updated with file content
    - expect: Import progress is shown
  3. Test drag and drop with invalid file type
    - expect: Error message indicates unsupported file type
    - expect: Grid remains unchanged

### 5. Export Formats

**Seed:** `tests/browser/seed/export-formats-setup.spec.ts`

#### 5.1. Markdown Export

**File:** `tests/browser/export-formats/markdown-export.spec.ts`

**Steps:**
  1. Create grid with sample data including headers
    - expect: Grid contains structured data ready for export
  2. Click 'Markdown' tab
    - expect: Markdown tab is active
    - expect: Markdown-specific options appear
    - expect: Text area shows markdown format
  3. Click 'Set Text From Grid' button
    - expect: Text area displays proper Markdown table format
    - expect: Headers are formatted correctly
    - expect: Data alignment follows Markdown standards
  4. Test different markdown formatting options
    - expect: Options modify output format appropriately
    - expect: Preview reflects selected formatting

#### 5.2. JSON Export

**File:** `tests/browser/export-formats/json-export.spec.ts`

**Steps:**
  1. Click 'JSON' tab
    - expect: JSON tab is active
    - expect: JSON-specific options are available
  2. Generate JSON from grid data
    - expect: Output is valid JSON format
    - expect: Data structure preserves grid relationships
    - expect: Column names become object keys
  3. Test JSON formatting options (pretty print, compact, etc.)
    - expect: Different formatting options produce appropriate JSON styles

#### 5.3. XML Export

**File:** `tests/browser/export-formats/xml-export.spec.ts`

**Steps:**
  1. Click 'XML' tab and configure XML options
    - expect: XML configuration options are available
    - expect: Root element name can be customized
  2. Generate XML from grid data
    - expect: Output is well-formed XML
    - expect: Data hierarchy reflects grid structure
    - expect: XML validates properly

#### 5.4. SQL Export

**File:** `tests/browser/export-formats/sql-export.spec.ts`

**Steps:**
  1. Click 'SQL' tab and set table name
    - expect: SQL options allow table name configuration
  2. Generate SQL INSERT statements
    - expect: Output contains valid SQL INSERT statements
    - expect: Table name matches configuration
    - expect: Data values are properly escaped

#### 5.5. HTML Export

**File:** `tests/browser/export-formats/html-export.spec.ts`

**Steps:**
  1. Click 'HTML' tab
    - expect: HTML tab is active
    - expect: HTML table options are available
  2. Generate HTML table
    - expect: Output is valid HTML table markup
    - expect: Headers are in <th> elements
    - expect: Data is properly structured in <td> elements

#### 5.6. All Other Formats

**File:** `tests/browser/export-formats/other-formats.spec.ts`

**Steps:**
  1. Test each remaining format: Delimited, JSONL, Code, Gherkin, ASCII
    - expect: Each format produces appropriate output
    - expect: Format-specific options work correctly
    - expect: Output matches format specifications

### 6. Export Options and Controls

**Seed:** `tests/browser/seed/export-options-setup.spec.ts`

#### 6.1. CSV Export Options

**File:** `tests/browser/export-options/csv-options.spec.ts`

**Steps:**
  1. Configure CSV options: Toggle 'Use Quotes' checkbox
    - expect: Quotes option changes export behavior
    - expect: Apply button becomes enabled
  2. Configure 'Use Header' option
    - expect: Header inclusion affects first line of output
  3. Modify Quote Char and Escape Char fields
    - expect: Custom quote and escape characters are applied
    - expect: Special characters are handled correctly
  4. Click 'Apply' button
    - expect: Options are applied to current output
    - expect: Text area updates with new formatting

#### 6.2. Preview and Copy Functions

**File:** `tests/browser/export-options/preview-copy.spec.ts`

**Steps:**
  1. Click 'Preview (10)' button
    - expect: Preview mode is activated
    - expect: Only first 10 rows are displayed
    - expect: Button text indicates current mode
  2. Toggle back to full view
    - expect: All data is displayed again
    - expect: Button text updates appropriately
  3. Click 'Copy' button
    - expect: Text content is copied to clipboard
    - expect: Success feedback is provided
    - expect: Copied content matches text area

### 7. Test Data Generation

**Seed:** `tests/browser/seed/test-data-setup.spec.ts`

#### 7.1. Basic Test Data Generation

**File:** `tests/browser/test-data/basic-generation.spec.ts`

**Steps:**
  1. Expand 'Test Data' section if collapsed
    - expect: Test data generation interface is visible
    - expect: Definition grid and controls are available
  2. Click '+ Add Column' in the definition grid
    - expect: New row is added to definition grid
    - expect: Column fields are editable (columnName, type, value)
  3. Enter column definition: Name='First Name', Type='faker', Value='faker.name.firstName'
    - expect: Definition is saved in the grid
    - expect: Text schema area updates
  4. Set 'How Many?' to 5 and click 'Generate' button
    - expect: 5 rows of test data are generated
    - expect: Main grid is populated with faker-generated names
    - expect: Each row contains a different first name

#### 7.2. Multiple Column Test Data

**File:** `tests/browser/test-data/multiple-columns.spec.ts`

**Steps:**
  1. Add multiple column definitions with different data types
    - expect: Multiple column definitions are created
  2. Include RegEx and Faker definitions (e.g., Email: 'faker.internet.email', Status: '(Active|Inactive)')
    - expect: Mixed definition types are accepted
  3. Generate data with multiple columns
    - expect: All columns are populated
    - expect: RegEx patterns produce valid variations
    - expect: Faker data matches expected types

#### 7.3. Generation Modes

**File:** `tests/browser/test-data/generation-modes.spec.ts`

**Steps:**
  1. Select 'New Table' mode and generate data
    - expect: Existing grid data is replaced
    - expect: New table is created from definitions
  2. Add existing data, then select 'Amend Table' mode and generate
    - expect: New data is appended to existing data
    - expect: Original data is preserved
  3. Select specific rows, choose 'Amend Selected' mode and generate
    - expect: Only selected rows are replaced with generated data
    - expect: Unselected rows remain unchanged

#### 7.4. Test Data Text Schema

**File:** `tests/browser/test-data/text-schema.spec.ts`

**Steps:**
  1. Enter test data definition directly in 'Test Data Text Schema' textarea
    - expect: Text schema accepts manual input
    - expect: Definition grid updates to match text input
  2. Use complex faker expressions and RegEx patterns
    - expect: Complex expressions are parsed correctly
    - expect: Generated data matches complex patterns
  3. Click 'Refresh Text Preview' button
    - expect: Text schema is synchronized with definition grid
    - expect: Preview reflects current definitions

### 8. Advanced Grid Features

**Seed:** `tests/browser/seed/advanced-features-setup.spec.ts`

#### 8.1. Row and Column Drag and Drop

**File:** `tests/browser/advanced-features/drag-drop-reorder.spec.ts`

**Steps:**
  1. Create a multi-row, multi-column grid with identifiable data
    - expect: Grid contains data that can be tracked during reordering
  2. Drag a row to a different position
    - expect: Row is moved to new position
    - expect: Data relationships are maintained
    - expect: Other rows adjust positions accordingly
  3. Drag a column header to reorder columns
    - expect: Column order changes
    - expect: All row data follows column reordering
    - expect: Column headers update positions

#### 8.2. Multi-Select Operations

**File:** `tests/browser/advanced-features/multi-select.spec.ts`

**Steps:**
  1. Select multiple rows using Ctrl+click
    - expect: Multiple rows are selected simultaneously
    - expect: Selection indicators show all selected rows
  2. Select range of rows using Shift+click
    - expect: Range selection works correctly
    - expect: All rows in range are selected
  3. Perform operations on multi-selected rows (delete, edit)
    - expect: Operations apply to all selected rows
    - expect: Unselected rows are unaffected

#### 8.3. Cell Editing

**File:** `tests/browser/advanced-features/cell-editing.spec.ts`

**Steps:**
  1. Double-click on a cell to enter edit mode
    - expect: Cell becomes editable
    - expect: Cursor appears in cell
    - expect: Cell content can be modified
  2. Edit cell content and press Enter
    - expect: Changes are saved
    - expect: Cell exits edit mode
    - expect: Modified content is preserved
  3. Test Tab navigation between cells
    - expect: Tab moves to next cell
    - expect: Shift+Tab moves to previous cell
    - expect: Navigation wraps appropriately

### 9. Error Handling and Edge Cases

**Seed:** `tests/browser/seed/error-handling-setup.spec.ts`

#### 9.1. Invalid Data Import

**File:** `tests/browser/error-handling/invalid-import.spec.ts`

**Steps:**
  1. Attempt to import malformed CSV data
    - expect: Error message is displayed
    - expect: Grid state is preserved
    - expect: User is informed of the issue
  2. Import file with unsupported format
    - expect: Appropriate error handling occurs
    - expect: No system crash or undefined behavior
  3. Import extremely large file
    - expect: System handles large data gracefully
    - expect: Performance remains acceptable or user is warned

#### 9.2. Boundary Conditions

**File:** `tests/browser/error-handling/boundary-conditions.spec.ts`

**Steps:**
  1. Create grid with maximum number of columns
    - expect: System handles many columns without breaking
    - expect: Performance remains acceptable
  2. Generate test data with very large 'How Many?' value
    - expect: Large data generation is handled appropriately
    - expect: User gets feedback on progress
  3. Test empty grid operations
    - expect: Operations on empty grid don't cause errors
    - expect: Appropriate messages are shown

#### 9.3. Browser Compatibility

**File:** `tests/browser/error-handling/browser-compatibility.spec.ts`

**Steps:**
  1. Test copy to clipboard functionality
    - expect: Clipboard operations work correctly
    - expect: Fallback methods work if clipboard API is unavailable
  2. Test drag and drop with different file types
    - expect: File type detection works correctly
    - expect: Unsupported files are rejected gracefully
  3. Test download functionality
    - expect: File downloads work across browsers
    - expect: Filename and content are correct

### 10. User Interface and Navigation

**Seed:** `tests/browser/seed/ui-navigation-setup.spec.ts`

#### 10.1. Navigation Links

**File:** `tests/browser/ui-navigation/navigation-links.spec.ts`

**Steps:**
  1. Navigate back to http://localhost:8000/app.html for initial state
    - expect: Navigates to home page
    - expect: Link opens in same window
  2. Click on 'Generator' link
    - expect: Navigates to generator.html page
    - expect: Generator page loads successfully
  3. Navigate back to app.html
    - expect: Can navigate back to app.html
    - expect: App functionality is preserved
  4. Test 'Docs' and 'Blog' links
    - expect: External links open appropriately
    - expect: Navigation doesn't break current session

#### 10.2. Instructions and Help

**File:** `tests/browser/ui-navigation/instructions-help.spec.ts`

**Steps:**
  1. Click on 'Instructions' section to expand
    - expect: Instructions section expands
    - expect: Comprehensive help text is visible
    - expect: Instructions are clear and accurate
  2. Verify help icons and tooltips throughout the interface
    - expect: Help icons provide relevant information
    - expect: Tooltips appear on hover
    - expect: Help text is contextually appropriate
  3. Collapse and expand instructions section
    - expect: Section state changes correctly
    - expect: Content visibility toggles properly

#### 10.3. Responsive Layout

**File:** `tests/browser/ui-navigation/responsive-layout.spec.ts`

**Steps:**
  1. Resize browser window to test responsive behavior
    - expect: Layout adapts to different screen sizes
    - expect: Grid remains usable
    - expect: No horizontal scrolling issues
  2. Test interface on mobile viewport sizes
    - expect: Interface remains functional on smaller screens
    - expect: Touch interactions work appropriately
