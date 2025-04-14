const axios = require('axios');
const httpHandler = require('../../core/http-handler');

// Mock axios
jest.mock('axios');

describe('HttpHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton's config
    httpHandler.config = {
      timeout: 5000,
      userAgent: 'test-agent',
      retryCount: 2,
      retryDelay: 1000
    };
  });

  describe('retryRequest', () => {
    it('should succeed on first attempt', async () => {
      const mockResponse = { data: 'success' };
      const requestFn = jest.fn().mockResolvedValue(mockResponse);

      const result = await httpHandler.retryRequest(requestFn);

      expect(result).toEqual(mockResponse);
      expect(requestFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockResponse = { data: 'success' };
      const requestFn = jest.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValue(mockResponse);

      const result = await httpHandler.retryRequest(requestFn);

      expect(result).toEqual(mockResponse);
      expect(requestFn).toHaveBeenCalledTimes(2);
    });

    it('should fail after all retries', async () => {
      const error = new Error('All attempts failed');
      const requestFn = jest.fn().mockRejectedValue(error);

      await expect(httpHandler.retryRequest(requestFn)).rejects.toThrow('All attempts failed');
      expect(requestFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('makeRequest', () => {
    it('should make a GET request with correct parameters', async () => {
      const mockResponse = { data: 'success' };
      axios.get.mockResolvedValue(mockResponse);

      const result = await httpHandler.makeRequest('https://example.com');

      expect(axios.get).toHaveBeenCalledWith('https://example.com', {
        timeout: 5000,
        headers: { 'User-Agent': 'test-agent' },
        validateStatus: null
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make a HEAD request for checkLink', async () => {
      const mockResponse = { status: 200 };
      axios.head.mockResolvedValue(mockResponse);

      const result = await httpHandler.checkLink('https://example.com');

      expect(axios.head).toHaveBeenCalledWith('https://example.com', {
        timeout: 5000,
        headers: { 'User-Agent': 'test-agent' },
        validateStatus: null
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle request failures', async () => {
      axios.get.mockRejectedValue(new Error('Request failed'));

      await expect(httpHandler.makeRequest('https://example.com')).rejects.toThrow('Request failed');
    });
  });
}); 