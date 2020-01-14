// find all files in the page
const files = $("div#files.diff-view .file");

for (let f = 0; f < files.length; f++) {

  // check if this is a CSV file
  const filename = files[f].querySelector("div[data-path]").getAttribute('data-path');
  if (filename.match(".*\.csv")) {

    // Get all diff lines
    const lines = files[f].querySelectorAll(".blob-code-inner.blob-code-marker");

    // Get data
    const old_data = []
    const new_data = []

    for (let l = 0; l < lines.length; l++) {

      // Parse data from line
      const line = lines[l].textContent;
      const data = $.csv.toArray(line.trim());
      const changeType = lines[l].getAttribute("data-code-marker");

      // Line has been added
      if (changeType !== "-") 
        new_data.push(data);

      // Line has been removed
      if (changeType !== "+") 
        old_data.push(data);

    }

    // Parse CSV
    const old_table = new daff.TableView(old_data);
    const new_table = new daff.TableView(new_data);

    const alignment = daff.compareTables(old_table,new_table).align();

    const data_diff = [];
    const table_diff = new daff.TableView(data_diff);

    const flags = new daff.CompareFlags();
    flags.show_unchanged = true;
    flags.show_unchanged_columns = true;
    flags.always_show_header = false;
    const highlighter = new daff.TableDiff(alignment,flags);
    highlighter.hilite(table_diff);

    const diff2html = new daff.DiffRender();
    diff2html.render(table_diff);
    diff_html = diff2html.html()

    files[f].querySelector("div.data").innerHTML = "<div class='csvhub-diff'>"+diff_html+"</div>";
  }

}
