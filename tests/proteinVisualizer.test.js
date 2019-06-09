const imjs = require('imjs');
const fetch = require('node-fetch');
const geneToProteinQuery = require('../src/queries/geneToProtein');
const accessionToPdbQuery = require('../src/queries/accessionToPdb');

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
			geneId: '1000090',
			serviceUrl: 'http://www.humanmine.org/human'
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
				geneId: '1100005' // some wrong gene id
			});

			const queryRes = geneToProteinQuery(
				wrongMockData.geneId,
				wrongMockData.serviceUrl,
				imjs
			);

			return expect(queryRes).rejects.toBe('No associated proteins found!');
		});
	});

	describe('accession -> ids', () => {
		const mockData = {
			proteinAccessionId: 'Q8IZ69'
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
