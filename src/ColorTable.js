const uniform_color_table = [
	['#FFFFFF', 'hydrogen (H)'],
	['#000000', 'carbon (C)'],
	['#2233FF', 'nitrogen (N)'],
	['#FF2200', 'oxygen (O)'],
	['#1FF01F', 'fluorine (F), chlorine (Cl)'],
	['#992200', 'bromine (Br)'],
	['#6600BB', 'iodine (I)'],
	['#00FFFF', 'noble gases (He, Ne, Ar, Xe, Kr)'],
	['#FF9900', 'phosphorus (P)'],
	['#FFE522', 'sulfur (S)'],
	['#FFAA77', 'boron (B), most transition metals'],
	['#7700FF', 'alkali metals (Li, Na, K, Rb, Cs, Fr)'],
	['#007700', 'alkaline earth metals (Be, Mg, Ca, Sr, Ba, Ra)'],
	['#999999', 'titanium (Ti)'],
	['#DD7700', 'iron (Fe)'],
	['#DD77FF', 'other elements']
];

const secondary_color_table = [
	['#FF0080', 'α helix'],
	['#A00080', `3${'\u2081\u2080'} helix`],
	['#600080', 'π helix'],
	['#FFC800', 'β strand'],
	['#6080FF', '(β) turn'],
	['#FFFFFF', 'other'],
	['#AE00FE', 'DNA'],
	['#FD0162', 'RNA'],
	['#A6A6FA', 'Carbohydrate'],
	['#808080', 'other']
];

const ColorTable = ({ colorMode }) => {
	const color_table =
		colorMode == 'uniform' ? uniform_color_table : secondary_color_table;
	return (
		<div className="color-table">
			<table>
				<tbody>
					{color_table.map(element => {
						return (
							<tr className="color-table-row">
								<td>
									<div
										className="color-table-box"
										style={{ background: element[0] }}
									></div>
								</td>

								<td>{element[1]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default ColorTable;
