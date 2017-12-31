import * as underscore from 'underscore'

export default class TableData {

  constructor(columns, columnNames, rows, comment) {
    this.columns = columns || [];
    this.columnNames = columnNames || [];
    this.rows = rows || [];
    this.comment = comment || '';
  };

  loadParagraphResult(paragraphResult) {

    if (!paragraphResult || paragraphResult.type !== 'TABLE') {
      console.log('Can not load paragraph result.');
      return;
    }

    var columns = [];
    var columnNames = [];
    var rows = [];
    var array = [];
    var textRows = paragraphResult.msg.split('\n');
    var comment = '';
    var commentRow = false;

    for (var i = 0; i < textRows.length; i++) {

      var textRow = textRows[i];

      if (commentRow) {
        comment += textRow;
        continue;
      }

      if (textRow === '' || textRow === '<!--TABLE_COMMENT-->') {
        if (rows.length > 0) {
          commentRow = true;
        }
        continue;
      }
      var textCols = textRow.split('\t');
      var cols = [];
      var cols2 = [];
      for (var j = 0; j < textCols.length; j++) {
        var col = textCols[j];
        if (i === 0) {
          columns.push({name: col, index: j, aggr: 'sum'});
        } else {
          cols.push(col);
          cols2.push({key: (columns[i]) ? columns[i].name : undefined, value: col});
        }
      }
      if (i !== 0) {
        rows.push(cols);
        array.push(cols2);
      }
    }

    columnNames = underscore.pluck(columns, 'name')

    this.comment = comment;
    this.columns = columns;
    this.columnNames = columnNames;
    this.rows = rows;

  }

}
