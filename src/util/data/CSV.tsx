export function convertArrayOfObjectsToCSV(args) {  
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  data = args.data || null
  if (data == null || !data.length) {
      return null
  }
  columnDelimiter = args.columnDelimiter || ','
  lineDelimiter = args.lineDelimiter || '\n'
  keys = Object.keys(data[0])
  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter
  data.forEach(function(item) {
      ctr = 0
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter
          result += item[key]
          ctr++
      });
      result += lineDelimiter
  })
  return result
}

export function downloadCSV(args) {  
  var data, filename, link
  var csv = this.convertArrayOfObjectsToCSV({
      data: args.items
  })
  if (csv == null) return
  filename = args.filename || 'data.csv'
  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=UTF-8,' + csv
  }
  data = encodeURI(csv)
  link = document.createElement('a')
  link.setAttribute('href', data)
  link.setAttribute('download', filename)
  document.getElementById('preloader').appendChild(link)
  link.click()
}
