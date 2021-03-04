import { describe, it } from 'mocha'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chai from 'chai'

chai.use(sinonChai)
const { expect } = chai

import logging, { LogLevel } from '../src'


const defaultProcessor = logging.config.processor
const defaultErrorProcessor = logging.config.errorProcessor

const stubWriter = {
  log: sinon.stub(),
  warn: sinon.stub(),
  error: sinon.stub()
}

const stubProcessor = sinon.stub().callsFake(defaultProcessor)
const stubErrorProcessor = sinon.stub().callsFake(defaultErrorProcessor)

beforeEach(() => {
  logging.configure({
    level: LogLevel.Debug,
    writer: stubWriter,
    processor: defaultProcessor,
    errorProcessor: defaultErrorProcessor
  })

  Date.now = sinon.stub().returns(42)

  stubWriter.log.resetHistory()
  stubWriter.warn.resetHistory()
  stubWriter.error.resetHistory()
  stubProcessor.resetHistory()
})

describe('logging', () => {
  describe('debug', () => {
    it('should log messages', () => {
      logging.debug({ foo: 'bar' })

      expect(stubWriter.log).to.have.been.calledOnceWith('level=debug timestamp=42 foo="bar"')
      expect(stubWriter.warn).to.not.have.been.called
      expect(stubWriter.error).to.not.have.been.called
    })
  })

  describe('info', () => {
    it('should log messages', () => {
      logging.info({ foo: 'bar' })

      expect(stubWriter.log).to.have.been.calledOnceWith('level=info timestamp=42 foo="bar"')
      expect(stubWriter.warn).to.not.have.been.called
      expect(stubWriter.error).to.not.have.been.called
    })
  })

  describe('warn', () => {
    it('should log messages', () => {
      logging.warn({ foo: 'bar' })

      expect(stubWriter.log).to.not.have.been.called
      expect(stubWriter.warn).to.have.been.calledOnceWith('level=warning timestamp=42 foo="bar"')
      expect(stubWriter.error).to.not.have.been.called
    })
  })

  describe('error', () => {
    it('should log messages', () => {
      logging.error(new Error('foobar'))

      expect(stubWriter.log).to.not.have.been.called
      expect(stubWriter.warn).to.not.have.been.called
      expect(stubWriter.error).to.have.been.calledOnce
    })
  })

  describe('custom processor', () => {
    it('should be called', () => {
      logging.configure({ processor: stubProcessor })
      logging.info({ foo: 'bar' })

      expect(stubProcessor).to.have.been.calledOnce
    })
  })

  describe('custom error processor', () => {
    it('should be called', () => {
      logging.configure({ errorProcessor: stubErrorProcessor })
      logging.error(new Error('foobar'))

      expect(stubErrorProcessor).to.have.been.calledOnce
    })
  })
})
