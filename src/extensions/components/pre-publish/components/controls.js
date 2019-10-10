/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect, withDispatch, select } = wp.data;
const { compose, ifCondition } = wp.compose;
const { Component } = wp.element;
const { PluginPrePublishPanel } = wp.editPost;
const { withSpokenMessages, CheckboxControl } = wp.components;

/**
 * Render plugin
 */
class PrePublishCheck extends Component {
	render() {
		const { postmeta, removeEmpty } = this.props;
		const isChecked = postmeta._editorskit_remove_empty;

		const panelBodyTitle = [
			__( 'Cleanup:' ),
			(
				<span className="editor-post-publish-panel__link" key="label">
					{ __( 'Remove Empty Blocks', 'block-options' ) }
				</span>
			),
		];

		return (
			<PluginPrePublishPanel
				className="editorskit-pre-publish-panel"
				title={ panelBodyTitle }
				initialOpen={ true }
			>
				<CheckboxControl
					label={ __( 'Automatically remove empty paragraphs', 'block-options' ) }
					checked={ isChecked }
					onChange={ removeEmpty }
				/>
			</PluginPrePublishPanel>
		);
	}
}

export default compose( [
	withSelect( () => ( {
		postmeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		isDisabled: select( 'core/edit-post' ).isFeatureActive( 'disableEditorsKitRemoveEmptyWriting' ),
	} ) ),
	withDispatch( ( dispatch, ownProps ) => {
		return {
			removeEmpty() {
				let metavalue;
				if ( typeof ownProps.postmeta !== 'undefined' && typeof ownProps.postmeta._editorskit_remove_empty !== 'undefined' ) {
					metavalue = ownProps.postmeta._editorskit_remove_empty;
				}

				dispatch( 'core/editor' ).editPost( {
					meta: {
						_editorskit_remove_empty: ! metavalue,
					},
				} );
			},
		};
	} ),
	ifCondition( ( props ) => {
		return ! props.isDisabled;
	} ),
	withSpokenMessages,
] )( PrePublishCheck );
