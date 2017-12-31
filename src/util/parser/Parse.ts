/* tslint:disable:no-trailing-whitespace */

import { IProperty, PropertyType } from './interfaces';
import { InterfaceParserHelper } from './InterfaceParserHelper';
import { EnumParserHelper } from './EnumParserHelper';

/**
 * Given some valid, well linted Typescript source code, extracts exported interfaces and enums.
 *
 * Note: requires that the closing '}' of interfaces and enums is the first char on its own line.
 *       It should otherwise be reasonably robust to handle various commenting or even code layout
 *       styles within the interface or enum.
 *
 * To specify default values for interfaces, use the JSDoc @default or @defaultvalue markup.
 * The rest of the line after @default will be captured as the default value.
 *
 * @export
 * @param {string} source Valid, reasonably well linted Typescript source code.
 * @param {string} [propsInterfaceOrEnumName] Name of an interface or enum if you only want to parse said interface or enum.
 * @returns {Array<IProperty>} An array of properties.
 */
export function parse(source: string, propsInterfaceOrEnumName?: string): IProperty[] {
  let props: IProperty[] = [];
  let regex: RegExp = null;
  let parseInfo;

  let propertyNameSuffix = (type: string) => type === 'interface' ? ' interface' : ' enum';
  let propertyType = (type: string) => type === 'interface' ? PropertyType.interface : PropertyType.enum;

  if (propsInterfaceOrEnumName) {
    regex = new RegExp(`export (interface|enum) ${propsInterfaceOrEnumName}(?: extends .*?)? \\{(.*[\\r\\n]*)*?\\}`);
    let regexResult = regex.exec(source);
    if (regexResult && regexResult.length > 0) {
      parseInfo = _parseEnumOrInterface(regexResult);
      return [<IProperty>{
        name: propsInterfaceOrEnumName,
        propertyName: propsInterfaceOrEnumName + propertyNameSuffix(regexResult[1]),
        propertyType: propertyType(regexResult[1]),
        property: parseInfo
      }];
    }
  } else {
    regex = new RegExp(`export (interface|enum) (\\S*?)(?: extends .*?)? \\{(.*[\\r\\n]*)*?\\}`, 'g');
    let regexResult: RegExpExecArray;
    let results: Array<IProperty> = [];
    while ((regexResult = regex.exec(source)) !== null) {
      parseInfo = _parseEnumOrInterface(regexResult);
      results.push(<IProperty>{
        name: regexResult[2],
        propertyName: regexResult[2] + propertyNameSuffix(regexResult[1]),
        propertyType: propertyType(regexResult[1]),
        property: parseInfo
      });
    }

    return results;
  }

  return props;
}

function _parseEnumOrInterface(regexResult: RegExpExecArray) {
  let parseInfo;
  if (regexResult[1] === 'interface') {
    let parser = new InterfaceParserHelper(regexResult[0]);
    parseInfo = parser.parse();
    parser = null;
  } else {
    let parser = new EnumParserHelper(regexResult[0]);
    parseInfo = parser.parse();
    parser = null;
  }
  return parseInfo;
}
