--Task 1-1

CREATE OR REPLACE PROCEDURE Employee_hire_sp (p_first_name      IN VARCHAR2, p_last_name       IN VARCHAR2, p_email           IN VARCHAR2, p_salary          IN NUMBER, p_hire_date       IN DATE, p_phone           IN VARCHAR2, p_job_id          IN VARCHAR2, p_manager_id      IN NUMBER, p_department_id   IN NUMBER) IS
BEGIN
    INSERT INTO hr_employees
    (employee_id, first_name, last_name, email,                     --Stensil of what values we are looking for.
    phone_number, hire_date, job_id, salary,
    manager_id, department_id)
    VALUES
    (HR_EMPLOYEES_SEQ.NEXTVAL, p_first_name, p_last_name, p_email,  --Input of all the vlaues to add into the program.
    p_phone, p_hire_date, p_job_id, p_salary,
    p_manager_id, p_department_id);
    COMMIT;                                                         --Commit the transactions
END Employee_hire_sp;

--Task 1-3
CREATE OR REPLACE PROCEDURE update_employee_info(
    p_employee_id IN NUMBER,
    p_new_salary  IN NUMBER DEFAULT NULL,
    p_new_phone   IN VARCHAR2 DEFAULT NULL,
    p_new_email   IN VARCHAR2 DEFAULT NULL
)
IS
BEGIN
    -- Update salary if a new value is provided, otherwise we skip on a null value.
    IF p_new_salary IS NOT NULL THEN
        UPDATE hr_employees
        SET salary = p_new_salary
        WHERE employee_id = p_employee_id;
    END IF;

    -- Update phone if a new value is provided, otherwise we skip on a null value.
    IF p_new_phone IS NOT NULL THEN
        UPDATE hr_employees
        SET phone_number = p_new_phone
        WHERE employee_id = p_employee_id;
    END IF;

    -- Update email if a new value is provided, otherwise we skip on a null value.
    IF p_new_email IS NOT NULL THEN
        UPDATE hr_employees
        SET email = p_new_email
        WHERE employee_id = p_employee_id;
    END IF;

    -- Commit the transaction
    COMMIT;
END update_employee_info;

-- Task 3
CREATE OR REPLACE PROCEDURE CHECK_SALARY(
    p_job_id HR_EMPLOYEES.JOB_ID%TYPE,
    p_salary HR_EMPLOYEES.SALARY%TYPE
) IS
    v_min_salary HR_JOBS.MIN_SALARY%TYPE;     --min captured salary.
    v_max_salary HR_JOBS.MAX_SALARY%TYPE;     --max captured salary.
BEGIN
    SELECT MIN_SALARY, MAX_SALARY             --finding min and max salary.
    INTO v_min_salary, v_max_salary
    FROM HR_JOBS
    WHERE JOB_ID = p_job_id;
    --raise an error if current user input is out of salary range.
    IF p_salary < v_min_salary OR p_salary > v_max_salary THEN
        RAISE_APPLICATION_ERROR(-20001,
            'Invalid salary ' || p_salary || '. Salaries for job ' ||
            p_job_id || ' must be between ' || v_min_salary || ' and ' ||
            v_max_salary || '.');
    END IF;
END CHECK_SALARY;

CREATE OR REPLACE TRIGGER EMP_SALARY_CHECK    --Trigger creation to check each salary fits in the appropriate range.
BEFORE INSERT OR UPDATE OF SALARY ON HR_EMPLOYEES
FOR EACH ROW
BEGIN
    CHECK_SALARY(:NEW.JOB_ID, :NEW.SALARY);
END EMP_SALARY_CHECK;