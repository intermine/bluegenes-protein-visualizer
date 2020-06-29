import React from 'react';
import pv from 'bio-pv';
import Loading from './Loading';
import queryGeneToProtein from './queries/geneToProtein';
import queryAccessionToPdb from './queries/accessionToPdb';
import queryProteinIdToProtein from './queries/proteinIdToProtein';
import ColorTable from './ColorTable';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		this.visualizer = React.createRef();
		this.state = {
			structureReady: true,
			pdbIds: null,
			filteredPdbIds: null,
			selectedId: 0,
			viewerMode: 'cartoon',
			colorMode: 'uniform',
			error: null,
			searchedId: '',
			hoveredId: null
		};
		this.initVisualizer = this.initVisualizer.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.fetchTitle = this.fetchTitle.bind(this);
	}

	componentDidMount() {
		const {
			entity: { value: entityId, class: entityClass },
			serviceUrl,
			testing
		} = this.props;

		// if mode is `testing` don't do cals
		if (testing) return;

		this.setState({ structureReady: false });

		const getPdbsAndRender = primaryAccession => {
			queryAccessionToPdb(primaryAccession)
				.then(ids => {
					this.setState({
						pdbIds: ids,
						filteredPdbIds: ids
					});
					this.initVisualizer(ids);
					this.fetchTitle(ids[0]);
				})
				.catch(error => {
					error =
						typeof error === 'string'
							? error
							: 'Could not download PDB file, please try again later!';
					this.setState({ error });
				});
		};

		if (entityClass.Protein) {
			queryProteinIdToProtein(entityId, serviceUrl).then(protein => {
				getPdbsAndRender(protein.primaryAccession);
			});
		} else {
			queryGeneToProtein(entityId, serviceUrl)
				.then(res => {
					const { proteins } = res;
					getPdbsAndRender(proteins[0].primaryAccession);
				})
				.catch(error => this.setState({ error }));
		}
	}

	initVisualizer(ids, selectedId) {
		const {
			colorMode,
			viewerMode,
			pdbIds,
			selectedId: stateSelectedId
		} = this.state;

		if (!ids) ids = pdbIds;
		if (!selectedId) selectedId = stateSelectedId;

		pv.io.fetchPdb(
			`https://files.rcsb.org/download/${ids[selectedId]}.pdb`,
			structure => {
				if (!structure)
					return this.setState({
						error: 'No results found in RCSB Protein Data Bank'
					});

				this.setState({ structureReady: true }, () => {
					// remove all current HTML from main element
					// initialise protein visualizer with default init options

					const visualizer = this.visualizer.current;
					visualizer.innerHTML = '';
					const viewer = pv.Viewer(visualizer, {
						quality: 'medium',
						antialias: true,
						outline: false,
						slabMode: 'auto'
					});

					const go = viewer.renderAs('structure', structure, viewerMode, {
						color:
							colorMode === 'uniform'
								? pv.color.ssSuccession()
								: pv.color.bySS(),
						showRelated: '1'
					});

					// find camera orientation such that the molecules biggest extents are
					// aligned to the screen plane.
					const rotation = pv.viewpoint.principalAxes(go);
					viewer.setRotation(rotation);

					// adapt zoom level to contain the whole structure
					viewer.autoZoom();
				});
			}
		);
	}

	updateSelected(idIndex) {
		this.setState({
			selectedId: idIndex,
			focusedIdTitle: '',
			detailsLoading: true
		});

		// fetch title for the `id` clicked
		const id = this.state.filteredPdbIds[idIndex];
		this.fetchTitle(id);

		this.visualizer.current.innerHTML = '';
		this.setState({ structureReady: false });
		this.initVisualizer(null, idIndex);
	}

	fetchTitle(id) {
		fetch(`https://www.rcsb.org/pdb/json/describePDB?structureId=${id}`)
			.then(res => res.json())
			.then(res =>
				this.setState({
					detailsLoading: false,
					focusedIdTitle: res[0].title
				})
			);
	}

	changeViewerMode(ev) {
		this.setState({ viewerMode: ev.target.value }, () => {
			this.visualizer.current.innerHTML = '';
			this.setState({ structureReady: false });
			this.initVisualizer();
		});
	}

	changeColoringMode(ev) {
		this.setState({ colorMode: ev.target.value }, this.initVisualizer);
	}

	handleSearch(ev) {
		const { value } = ev.target;
		this.setState(
			{
				filteredPdbIds: this.state.pdbIds.filter(
					id => id.toLowerCase().indexOf(value.toLowerCase()) !== -1
				)
			},
			() => this.fetchTitle(this.state.filteredPdbIds[0])
		);
	}

	render() {
		let PdbIdList;
		if (this.state.filteredPdbIds) {
			PdbIdList = this.state.filteredPdbIds.map((id, i) => (
				<div key={i}>
					<div
						className={`option ${this.state.selectedId == i && 'selected'}`}
						onClick={() => this.updateSelected(i)}
					>
						{id}
					</div>
					{this.state.selectedId === i && (
						<div className="details-panel">
							{this.state.detailsLoading ? (
								<Loading />
							) : (
								<React.Fragment>
									<h3>{this.state.focusedIdTitle}</h3>
									<a
										href={`https://www.rcsb.org/structure/${id}`}
										rel="noopener noreferrer"
										target="_blank"
										className="title-text"
									>
										open RCSB page
									</a>
								</React.Fragment>
							)}
						</div>
					)}
				</div>
			));
		}

		const ViewerModes = [
			'sline',
			'lines',
			'trace',
			'lineTrace',
			'cartoon',
			'tube',
			'spheres'
		].map(m => (
			<option key={m} value={m}>
				{m}
			</option>
		));

		const ColoringModes = ['uniform', 'By Secondary Structure'].map(m => (
			<option key={m} value={m}>
				{m}
			</option>
		));

		if (this.state.error)
			return <div className="viz-container error">{this.state.error}</div>;

		if (!PdbIdList)
			return (
				<div className="rootContainer">
					<Loading text="Fetching associated PDB ids" />
				</div>
			);

		return (
			<div className="rootContainer">
				{this.state.structureReady ? (
					<div className="viz-container" ref={this.visualizer} />
				) : (
					<div className="viz-container">
						<Loading text="Initialising Visualizer..." />
					</div>
				)}
				<div className="select-box">
					<span className="heading">Select Viewer Mode</span>
					<select
						placeholder="Select viewer mode"
						className="viewer-select"
						value={this.state.viewerMode}
						onChange={this.changeViewerMode.bind(this)}
					>
						{ViewerModes}
					</select>
					<span className="heading">Select Coloring Mode</span>
					<select
						placeholder="Select viewer mode"
						className="viewer-select"
						// value={this.state.viewerMode}
						onChange={this.changeColoringMode.bind(this)}
					>
						{ColoringModes}
					</select>
					<input
						className="heading"
						placeholder="Search and Select a PDB ID"
						onChange={this.handleSearch}
					/>
					<div style={{ maxHeight: 300, overflow: 'scroll' }}>
						{PdbIdList.length ? PdbIdList : 'No search results!'}
					</div>
					<div>
						<ColorTable colorMode={this.state.colorMode} />
					</div>
				</div>
			</div>
		);
	}
}

export default RootContainer;
