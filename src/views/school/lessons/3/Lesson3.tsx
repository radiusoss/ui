import * as React from 'react'
import ExerciseCard from '../../../../components/ExerciseCard'
import { Code, Code1Text, Code2Text, Code3Text } from './Code'
import MockContent from './../../../message/MockContent'

const CodeText = require('!raw-loader!./../../../../../src/views/school/lessons/3/Code.tsx') as string

export default class Lesson3 extends React.Component<any, any> {

  public render() {

    return (
      
      <div>

        <MockContent/>

        <h1>Lesson 3: xxx</h1>

        <ExerciseCard 
          content={
            <div>
              <ul>
                <li>...</li>
              </ul>
            </div>
          }
          prerequisites={
            <div>
              <ul>
                <li>...</li>
              </ul>
            </div>
          }        
        >
        </ExerciseCard>

        <ExerciseCard title="Step 1 - xxx" code={ Code1Text } language="scala" noteId="xxx">
        </ExerciseCard>

        <ExerciseCard title="Step 2 - xxx" code={ Code2Text } language="scala" noteId="xxx">
        </ExerciseCard>

        <ExerciseCard title="Step 3 - xxx" code={ Code3Text } language="scala" noteId="xxx">
        </ExerciseCard>

        <ExerciseCard title='Code' code={ CodeText } language="scala">
            <Code />
        </ExerciseCard>

      </div>

    )

  }

}
