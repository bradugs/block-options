/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import './styles/editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { select } = wp.data;
const { BlockControls } = wp.editor;
const { applyFormat, toggleFormat, removeFormat } = wp.richText;
const { Toolbar, IconButton, Popover, ColorPalette } = wp.components;

class InlineColorsToolbar extends Component {
	constructor( props ) {
		super( ...arguments );

		this.state = {
			openPopover: false,
		};
	}

	render() {

		const {
			name,
			isActive,
			value,
			onChange,
		} = this.props;

		const colors = get( select( 'core/block-editor' ).getSettings(), [ 'colors' ], [] );

		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-dropdown-menu__toggle"
							icon="editor-textcolor"
							aria-haspopup="true"
							label={ __( 'Background' ) }
							tooltip={ __( 'Background' ) }
							onClick={ () => this.setState( { openPopover: ! this.state.openPopover } ) }
						>
							<span className="components-dropdown-menu__indicator" />
						</IconButton>
						
						{ this.state.openPopover && (
							<Popover
								position="bottom center"
								className="components-editorskit__inline-color-popover"
								onClickOutside={ ( onClickOutside ) =>{ console.log( onClickOutside ) } }
							>
								<span class="components-base-control__label">{ __( 'Highlighted Text Color' ) }</span>
								<ColorPalette
									colors={ colors }
									onChange={ ( color ) => {
										if( color ){
											onChange(
												toggleFormat( value, {
													type: name,
													attributes: {
														style: `color:${color}`
													},
												} ) 
											);
										}else{
											onChange( removeFormat( value, name ) )
										}
										console.log( color );
									} }
								>
								</ColorPalette>
							</Popover>
						) }
					</Toolbar>
				</BlockControls>
			</Fragment>
		);
	}

}

export default InlineColorsToolbar;