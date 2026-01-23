/**
 * Data Migration Script
 *
 * Migrates enriched_results.json to Supabase database.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node data/migrate.js
 *
 * Prerequisites:
 *   1. Create tables in Supabase (see schema.sql)
 *   2. Set environment variables
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrate() {
    console.log('Starting migration...');

    // Load the JSON data
    const dataPath = path.join(__dirname, 'enriched_results.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`Error: ${dataPath} not found`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const apps = Object.entries(data);

    console.log(`Found ${apps.length} apps to migrate`);

    let successCount = 0;
    let errorCount = 0;

    for (const [appName, appData] of apps) {
        try {
            const { error } = await supabase.from('apps').upsert({
                app_name: appName,
                app_level_enrichment: appData.app_level_enrichment || {},
                teams: appData.teams || [],
                qa_issues: appData.qa_issues || [],
                partnerships_issues: appData.partnerships_issues || [],
                qa_total_actions: appData.qa_total_actions || 0,
                partnerships_total_actions: appData.partnerships_total_actions || 0,
                total_cost_to_unblock: appData.total_cost_to_unblock || null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'app_name'
            });

            if (error) {
                console.error(`Error migrating ${appName}:`, error.message);
                errorCount++;
            } else {
                console.log(`Migrated: ${appName}`);
                successCount++;
            }
        } catch (err) {
            console.error(`Exception migrating ${appName}:`, err.message);
            errorCount++;
        }
    }

    console.log('\nMigration complete!');
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
