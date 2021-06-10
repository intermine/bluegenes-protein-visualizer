const imjs = require('imjs');
const fetch = require('node-fetch');
const geneToProteinQuery = require('../src/queries/geneToProtein');
const accessionToPdbQuery = require('../src/queries/accessionToPdb');
const proteinIdToProteinQuery = require('../src/queries/proteinIdToProtein');

beforeEach(() => {
	// define `append` as a mocked fn
	const append = jest.fn();
	// set test `Headers`
	global.Headers = () => ({
		append: append
	});
});

describe('queries', () => {
	describe('gene -> protein', () => {
		const mockData = {
			geneId: '1145104',
			serviceUrl: 'https://www.humanmine.org/humanmine'
		};

		test('should return a promise resolving with gene having proteins', () => {
			expect.assertions(4);

			const queryRes = geneToProteinQuery(
				mockData.geneId,
				mockData.serviceUrl,
				imjs
			);

			expect(queryRes).toBeInstanceOf(Promise);
			return queryRes.then(res => {
				expect(res).toHaveProperty('proteins');
				expect(res.proteins).toBeInstanceOf(Array);
				expect(res.proteins.length).toBeGreaterThanOrEqual(1);
			});
		});

		test('should throw error if no protein associated with the given gene id', () => {
			const wrongMockData = Object.assign({}, mockData, {
				geneId: '1100000' // some wrong gene id
			});

			const queryRes = geneToProteinQuery(
				wrongMockData.geneId,
				wrongMockData.serviceUrl,
				imjs
			);

			return expect(queryRes).rejects.toBe('No associated proteins found.');
		});
	});

	describe('proteinId -> protein', () => {
		const mockData = {
			proteinId: '21035748',
			serviceUrl: 'https://www.humanmine.org/humanmine'
		};

		test('should return a promise resolving with correct protein', () => {
			expect.assertions(2);

			const queryRes = proteinIdToProteinQuery(
				mockData.proteinId,
				mockData.serviceUrl,
				imjs
			);

			expect(queryRes).toBeInstanceOf(Promise);
			return queryRes.then(res => {
				expect(res).toHaveProperty('primaryAccession');
			});
		});

		test('should throw error if no protein associated with the given protein id', () => {
			const wrongMockData = Object.assign({}, mockData, {
				proteinId: '20274300' // some wrong protein id
			});

			const queryRes = proteinIdToProteinQuery(
				wrongMockData.proteinId,
				wrongMockData.serviceUrl,
				imjs
			);

			return expect(queryRes).rejects.toBe('Protein not found.');
		});
	});

	describe('accession -> ids', () => {
		const mockData = {
			proteinAccessionId: 'P15976'
		};
		test('should return a promise resolving with correct pdb ids', () => {
			const queryRes = accessionToPdbQuery(mockData.proteinAccessionId, fetch);

			expect(queryRes).toBeInstanceOf(Promise);
			return queryRes.then(ids => {
				expect(ids).toBeInstanceOf(Array);
				expect(ids.length).toBeGreaterThanOrEqual(1);
				ids.forEach(id => expect(id.length).toBe(4));
			});
		});
	});
});
