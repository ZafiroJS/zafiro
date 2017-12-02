import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "demo" })
export default class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column()
    public givenName: string;

    @Column()
    public familyName: string;

    @Column()
    public isBanned: boolean;

}
