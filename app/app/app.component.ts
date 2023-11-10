import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
    addDoc,
    collectionData,
    doc,
    docData,
    Firestore,
} from '@angular/fire/firestore';
import {
    faAngular,
    faCss3,
    faHtml5,
    faJs,
    faNode,
    faReact,
    faSalesforce,
    faThinkPeaks,
    faUnity,
} from '@fortawesome/free-brands-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import JsonData from '../assets/me.json';
import { FilterIconPair, FilterService } from './filter.service';
import { ContactMe } from './models/contact-me';
import { Education } from './models/education';
import { FilterItem } from './models/filter-item';
import { Role } from './models/role';
import { SkillBlock } from './models/skill-block';
import moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    title = 'Resume';

    item$: Observable<any>;

    experienceList: Array<Role> = JsonData.experience;
    skillsLists: Array<SkillBlock> = JsonData.skills;
    contact: ContactMe = JsonData.contact;
    education: Education = JsonData.education;

    filterObjects: Array<FilterIconPair> = new Array<FilterIconPair>();
    filterIsExpanded: boolean = true;

    @ViewChild('app_container') appContainerElement!: ElementRef;
    @ViewChild('mobile_underlay') mobileUnderlayElement!: ElementRef;

    constructor(firestore: Firestore, private sanitizer: DomSanitizer) {
        if (window.innerWidth < 600) {
            this.filterIsExpanded = false;
        }

        const docRef = doc(firestore, 'resumes/krtYPHqlrLLVzPVV9R69'); //collection(firestore, 'resumes');
        this.item$ = docData(docRef);
        this.item$.subscribe((value) => {
            if (!value) {
                return;
            }

            if (value.experience && value.experience.forEach) {
                value.experience.forEach((role: Role) => {
                    role.experience = role.experience.sort((a, b) => {
                        if (a.startDate)
                            return moment(a.startDate).isBefore(b.startDate)
                                ? 1
                                : -1;
                        else if (a.priority && b.priority)
                            return a.priority > b.priority ? 1 : -1;
                        else return 0;
                    });

                    role.experience.forEach((experience) => {
                        experience.notes = experience.notes.map((note) => {
                            return this.safeHtml(note);
                        });
                    });
                });
            }

            console.log(value);

            this.experienceList = value.experience;
            this.skillsLists = value.skills;
            this.contact = value.contact;
            this.education = value.education;
        });

        // Add all the filters
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.CSharp,
                'C#',
                FilterService.NoIcon,
                false,
                'csharp'
            )
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.Unity, 'Unity', faUnity)
        );
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.Xamarin,
                'Xamarin',
                FilterService.NoIcon,
                false,
                'xamarin'
            )
        );
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.Salesforce,
                'Salesforce',
                faSalesforce
            )
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.Angular, 'Angular', faAngular)
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.HTML, 'HTML', faHtml5)
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.CSS, 'CSS', faCss3)
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.JavaScript, 'JavaScript', faJs)
        );
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.TypeScript,
                'TypeScript',
                FilterService.NoIcon,
                false,
                'typescript'
            )
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.NodeJS, 'NodeJS', faNode)
        );
        this.filterObjects.push(
            new FilterIconPair(FilterItem.React, 'React', faReact)
        );
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.Flutter,
                'Flutter',
                FilterService.NoIcon,
                false,
                'flutter'
            )
        );
        this.filterObjects.push(
            new FilterIconPair(
                FilterItem.CPlusPlus,
                'C/C++',
                FilterService.NoIcon,
                false,
                'cplusplus'
            )
        );
    }

    stripLinks(htmlString: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Find all <a> tags
        const links = doc.querySelectorAll('a');

        // Replace each <a> tag with just its text
        links.forEach((link: any) => {
            link.replaceWith(link.textContent);
        });

        return doc.body.innerHTML;
    }

    safeHtml(note: string) {
        return this.stripLinks(note);
    }

    ngAfterViewInit() {
        // Are we on a mobile device?
        if (window.innerWidth < 600) {
            this.mobileUnderlayElement.nativeElement.style.height =
                window.screen.availHeight + 'px';
            this.appContainerElement.nativeElement.style.backgroundSize =
                'auto ' + window.screen.availHeight + 'px';
            this.filterIsExpanded = false;
        }
    }

    ToggleFilterItem(filtereableItem: FilterIconPair) {
        FilterService.ToggleFilterItem(filtereableItem);
    }

    CheckFlag(item: FilterIconPair): boolean {
        return (FilterService.CurrentFilters & item.value) != 0;
    }

    FilterToolbarToggled(isExpanded: boolean) {
        this.filterIsExpanded = isExpanded;
    }
}
