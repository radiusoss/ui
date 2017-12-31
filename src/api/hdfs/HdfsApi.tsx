import * as React from 'react'
import { Result } from '../../util/rest/RestClient'
import { HdfsClient, IHdfsClient } from './client/HdfsClient'
import { FileStatusProperties } from './client/HdfsClient'
import { HdfsClientFactory } from './client/HdfsClientFactory'

export default class HdfsApi {
  private hdfsClient: IHdfsClient
  private fileStatuses: Array<FileStatusProperties>

  public constructor(props) {
    this.hdfsClient = HdfsClientFactory.create({
      url: "",
      path: 'webhdfs/v1',
      username: ''
    })
  }

  async listStatus(path) {
    return this.hdfsClient.listStatus(path)
  }

}
