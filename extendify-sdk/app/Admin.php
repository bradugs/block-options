<?php
/**
 * Admin.
 */

namespace Extendify\ExtendifySdk;

use Extendify\ExtendifySdk\App;

/**
 * This class handles any file loading for the admin area.
 */
class Admin
{

    /**
     * The instance
     *
     * @var $instance
     */
    public static $instance = null;

    /**
     * Adds various actions to set up the page
     *
     * @return self|void
     */
    public function __construct()
    {
        if (self::$instance) {
            return self::$instance;
        }

        self::$instance = $this;
        $this->loadScripts();
    }

    /**
     * Adds scripts to the admin
     *
     * @return void
     */
    public function loadScripts()
    {
        \add_action(
            'admin_enqueue_scripts',
            function ($hook) {
                if (!$this->checkItsGutenbergPost($hook)) {
                    return;
                }

                $this->addScopedScriptsAndStyles();
            }
        );
    }

    /**
     * Makes sure we are on the correct page
     *
     * @param string $hook - An optional hook provided by WP to identify the page.
     * @return boolean
     */
    public function checkItsGutenbergPost($hook = '')
    {
        // TODO: Maybe there's a better check here so we can show on other pages too.
        return $hook && in_array($hook, ['post.php', 'post-new.php'], true);
    }

    /**
     * Adds various JS scripts
     *
     * @return void
     */
    public function addScopedScriptsAndStyles()
    {
        $version = App::$environment === 'PRODUCTION' ? App::$version : uniqid();

        \wp_register_script(
            App::$slug . '-scripts',
            EXTENDIFYSDK_BASE_URL . 'public/build/extendify-sdk.js',
            [
                'wp-api',
                'wp-i18n',
                'wp-components',
                'wp-element',
                'wp-editor',
            ],
            $version,
            true
        );
        \wp_localize_script(
            App::$slug . '-scripts',
            'extendifySdkData',
            [
                'root' => \esc_url_raw(rest_url(APP::$slug . '/' . APP::$apiVersion)),
                'nonce' => \wp_create_nonce('wp_rest'),
            ]
        );
        \wp_enqueue_script(App::$slug . '-scripts');

        \wp_set_script_translations(App::$slug . '-scripts', App::$textDomain);

        \wp_enqueue_style(
            App::$slug . '-theme',
            EXTENDIFYSDK_BASE_URL . 'public/build/extendify-sdk.css',
            [],
            $version,
            'all'
        );
    }
}
