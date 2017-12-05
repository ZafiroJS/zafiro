import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { mustBe, a } from "zafiro-validators";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    @mustBe(a.number().optional())
    public id: number;

    @Column({ unique: true })
    @mustBe(a.string().email().required())
    public email: string;

    @Column()
    @mustBe(a.string().min(3).required())
    public givenName: string;

    @Column()
    @mustBe(a.string().min(3).required())
    public familyName: string;

    @Column()
    @mustBe(a.boolean().required())
    public isBanned: boolean;

}

