<?php

namespace Database\Seeders;

use App\Enums\AnalystType;
use App\Models\Client;
use App\Models\Coligate;
use App\Models\User;
use App\Enums\HealthScore;
use App\Enums\ImplementationType;
use App\Enums\PriorityLevel;
use App\Enums\DemandLevel;
use App\Enums\Level;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void {

        $faker = Faker::create('pt_BR');

        $client = Client::create([
            'id' => $faker->uuid,
            'name' => 'Padrão',
            'email' => $faker->email,
            'phone' => $faker->phoneNumber,
            'contact_name' => $faker->name,
            'url' => 'https://crmpadrao.valar.com.br',
            'field_link_applyment' => $faker->url,
            'status' => true,
            'logo' => $faker->image(),
            'favicon' => $faker->image(),
            'color_primary' => $faker->hexColor,
            'background' => $faker->image(),
            'contract_start_date' => $faker->date(),
            'foundation_date' => $faker->date(),
            'old_contractual_level' => $faker->randomElement(['1', '2', '3', '4', '5']),
            'contractual_level' => $faker->randomElement(Level::cases()),
            'potential_level' => $faker->randomElement(Level::cases()),
            'demand_level' => $faker->randomElement(DemandLevel::cases()),
            'priority_level' => $faker->randomElement(PriorityLevel::cases()),
            'implementation_type' => $faker->randomElement(ImplementationType::cases()),
            'general_observations' => $faker->text,
            'analyst_type' => $faker->randomElement(AnalystType::cases()),
            'health_score' => $faker->randomElement(HealthScore::cases()),
        ]);

        $coligate = Coligate::create([
            'id' => $faker->uuid,
            'client_id' => $client->id,
            'logo' => $faker->image(),
            'name' => $faker->name,
            'email' => $faker->email,
            'cnpj' => '12345678000199',
            'cep' => '76919000',
            'street' => 'Rua Bahia',
            'number' => '123',
            'complement' => 'Casa',
            'district' => 'Centro',
            'city' => 'Ministro Andreazza',
            'state' => 'RO',
            'country' => 'Brasil',
            'status' => true
        ]);

        User::create([
            'name' => 'Administrador',
            'email' => 'administrador@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('@mpresaPC10'),
            'change_password' => true,
            'status' => true,
            'remember_token' => Str::random(10),
            'coligate_id' => $coligate->id,
            'client_id' => $client->id,
            'created_by' => null,
            'updated_by' => null,

        ]);

        if (env('APP_ENV') == 'local') {
            $this->call([
                ClientSeeder::class,
                    /* ColigateSeeder::class, */
                SystemSeeder::class,
                ProfileSeeder::class,
                PermissionSeeder::class,
                ProfilePermissionSeeder::class,
                UserSeeder::class,
            ]);
        }
    }
}
