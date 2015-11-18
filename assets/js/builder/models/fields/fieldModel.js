/**
 * Model that represents our form fields.
 * 
 * @package Ninja Forms builder
 * @subpackage Fields
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			objectType: 'Field',
			editActive: false
		},

		initialize: function() {
			// Listen for model attribute changes
			this.bind( 'change', this.changeSetting, this );
			
			// Get our parent field type.
			var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', this.get( 'type' ) );
			var parentType = fieldType.get( 'parentType' );

			// Loop through our field type "settingDefaults" and add any default settings.
			var that = this;
			_.each( fieldType.get( 'settingDefaults' ), function( val, key ) {
				if ( ! that.get( key ) ) {
					that.set( key, val );
				}
			} );
			
			/*
			 * Trigger an init event on three channels:
			 * 
			 * fields
			 * fields-parentType
			 * field-type
			 *
			 * This lets specific field types modify model attributes before anything uses them.
			 */ 
			nfRadio.channel( 'fields' ).trigger( 'init:fieldModel', this );
			nfRadio.channel( 'fields-' + parentType ).trigger( 'init:fieldModel', this );
			nfRadio.channel( 'fields-' + this.get( 'type' ) ).trigger( 'init:fieldModel', this );
		},

		/**
		 * When we change the model attributes, fire an event saying we've changed something.
		 * 
		 * @since  3.0
		 * @return void
		 */
		changeSetting: function() {
			nfRadio.channel( 'fields' ).trigger( 'update:setting', this );
		}
	} );
	
	return model;
} );