import * as sb from 'stream-buffers'
import { HdfsClientFactory } from './HdfsClientFactory'
import { IHdfsClient } from './HdfsClient'
import { expect } from 'chai'

describe('WebHdfs Integration', () => {

  it('throws 404 error when not found.', async () => {
    const path = 'integration/DoesNotExist.txt';
    const client: IHdfsClient = HdfsClientFactory.create({
      url: 'http://localhost:50070',
      path: 'webhdfs/v1/testing/'
    })
    var result = await client.getFileStatus(path)
    expect(result.success).to.be.equal(false)
  })

  it('can create a directory', async () => {
    const client: IHdfsClient = HdfsClientFactory.create({
      url: 'http://localhost:50070',
      path: 'webhdfs/v1/testing/',
      username: 'datalayer'
    })
    const path = 'integration/'
    var outcome = await client.makeDirectory(path)
    expect(outcome.success).to.be.equal(true)
  })

  it('can list status', async () => {
    const client: IHdfsClient = HdfsClientFactory.create({
      url: 'http://localhost:50070',
      path: 'webhdfs/v1/testing/',
      username: 'datalayer'
    })
    var outcome = await client.listStatus("/")
    expect(outcome.success).to.be.equal(true)
  })

  it('can roundtrip a file.', async (done) => {
    const hdfsPath = 'integration/roundtrip.txt';
    const client: IHdfsClient = HdfsClientFactory.create({
      url: 'http://localhost:50070',
      path: 'webhdfs/v1/testing/',
      username: 'datalayer'
    })
    const expected: string = 'this is my test string that I am round-tripping.\n have a good trip!';
    var inputStream = new sb.ReadableStreamBuffer();
    inputStream.put(expected);
    inputStream.stop();
    var outcome = await client.createFile(inputStream, hdfsPath, { overwrite: true });
    expect(outcome.success).to.be.equal(true);
    var outStream = new sb.WritableStreamBuffer();
/*
    client.OpenFile(hdfsPath)
      .on('complete', assert)
      .pipe(outStream);
    function assert(): void {
      outStream.end();
      var actual = outStream.getContentsAsString();
      expect(actual).toEqual(expected);
      done()
    }
*/ 
 })

})
