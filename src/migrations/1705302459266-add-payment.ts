import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayment1705302459266 implements MigrationInterface {
    name = 'AddPayment1705302459266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`city\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`countryId\` int NOT NULL, \`stateId\` int NOT NULL, \`countryName\` varchar(255) NOT NULL, \`stateName\` varchar(255) NOT NULL, INDEX \`IDX_bc0f869fd3ce593c8972b66c93\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`countryId\` int NOT NULL, \`stateId\` int NOT NULL, \`cityId\` int NOT NULL, \`polygon\` text NOT NULL, INDEX \`IDX_de57c2ed897b81db1e76fedc3f\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`areaId\` int NOT NULL, \`userId\` int NOT NULL, \`countryId\` int NOT NULL, \`stateId\` int NOT NULL, \`cityId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`countryName\` varchar(255) NOT NULL, \`stateName\` varchar(255) NOT NULL, \`cityName\` varchar(255) NOT NULL, \`latitude\` int NOT NULL, \`longitude\` int NOT NULL, \`detail\` varchar(255) NOT NULL, \`postalCode\` varchar(255) NOT NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_b0ef5bbd388628e6df422d2953\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`country\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`flag\` varchar(255) NOT NULL, INDEX \`IDX_0f3d4c915928a15aa26768facd\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`orderId\` int NOT NULL, \`referenceId\` varchar(255) NOT NULL, \`intent\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`paymentId\` varchar(255) NOT NULL, \`currencyCode\` varchar(255) NOT NULL, \`value\` decimal(18,3) NOT NULL, \`responses\` json NOT NULL, INDEX \`IDX_a6de77b838abb0ae454c0cb367\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`state\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`countryId\` int NOT NULL, \`countryName\` varchar(255) NOT NULL, INDEX \`IDX_373aa6d5644361c166b57c6046\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shopping_cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`items\` json NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_7127a003d480ceb77b974cc3f2\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`userId\``);
        await queryRunner.query(`DROP INDEX \`IDX_7127a003d480ceb77b974cc3f2\` ON \`shopping_cart\``);
        await queryRunner.query(`DROP TABLE \`shopping_cart\``);
        await queryRunner.query(`DROP INDEX \`IDX_373aa6d5644361c166b57c6046\` ON \`state\``);
        await queryRunner.query(`DROP TABLE \`state\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6de77b838abb0ae454c0cb367\` ON \`payment\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP INDEX \`IDX_0f3d4c915928a15aa26768facd\` ON \`country\``);
        await queryRunner.query(`DROP TABLE \`country\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0ef5bbd388628e6df422d2953\` ON \`address\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP INDEX \`IDX_de57c2ed897b81db1e76fedc3f\` ON \`area\``);
        await queryRunner.query(`DROP TABLE \`area\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc0f869fd3ce593c8972b66c93\` ON \`city\``);
        await queryRunner.query(`DROP TABLE \`city\``);
    }

}
