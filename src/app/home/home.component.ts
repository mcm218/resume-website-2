import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
    faAngular,
    faCss3,
    faHtml5,
    faJs,
    faNode,
    faReact,
    faSalesforce,
    faUnity,
} from '@fortawesome/free-brands-svg-icons';
// import JsonData from '../assets/me.json';
import { FilterIconPair, FilterService } from '../services/filter.service';
import { ResumeService } from '../services/resume.service';
import { ContactMe } from '../models/contact-me';
import { Education } from '../models/education';
import { FilterItem } from '../models/filter-item';
import { Role } from '../models/role';
import { SkillBlock } from '../models/skill-block';
import moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
    title = 'Resume';

    experienceList: Array<Role> = new Array<Role>();
    skillsLists: Array<SkillBlock> = new Array<SkillBlock>();
    contact: ContactMe = new ContactMe();
    education: Education = new Education();

    filterObjects: Array<FilterIconPair> = new Array<FilterIconPair>();
    filterIsExpanded: boolean = true;

    @ViewChild('app_container') appContainerElement!: ElementRef;
    @ViewChild('mobile_underlay') mobileUnderlayElement!: ElementRef;

    loadResume(resumeService: ResumeService, id: string) {
        return resumeService.getResume(id);
    }

    constructor(resumeService: ResumeService) {
        if (window.innerWidth < 600) {
            this.filterIsExpanded = false;
        }

        this.loadResume(resumeService, 'krtYPHqlrLLVzPVV9R69').subscribe((value: any) => {
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
