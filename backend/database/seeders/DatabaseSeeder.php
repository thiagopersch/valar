<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Coligate;
use App\Models\User;
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
            'url' => 'https://crmpadrao.valar.com.br',
            'field_link_applyment' => $faker->url,
            'status' => true,
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
                    /* ClientSeeder::class,
                    ColigateSeeder::class, */
                SystemSeeder::class,
                ProfileSeeder::class,
                PermissionSeeder::class,
                ProfilePermissionSeeder::class,
                UserSeeder::class,
            ]);
        }
    }
}
